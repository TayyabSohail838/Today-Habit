// Vercel serverless function: POST /api/chat
// Uses Google Gemini API (gemini-1.5-flash with fallback) to power the habit assistant.

export const config = { runtime: "edge" };

function buildSystemPrompt(habitContext) {
  const { habits = [], logs = {} } = habitContext ?? {};
  const today = new Date().toISOString().slice(0, 10);

  const DAY_MS = 86_400_000;

  function currentStreak(habitLogs) {
    let streak = 0;
    let cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    while (habitLogs[cursor.toISOString().slice(0, 10)]) {
      streak++;
      cursor = new Date(cursor.getTime() - DAY_MS);
    }
    return streak;
  }

  const active = habits.filter((h) => !h.archived);
  const completedToday = active.filter((h) => logs[h.id]?.[today]).length;

  const habitSummaries = active.map((h) => {
    const habitLogs = logs[h.id] ?? {};
    const totalLogged = Object.keys(habitLogs).length;
    const streak = currentStreak(habitLogs);
    const createdDaysAgo = h.createdAt
      ? Math.max(1, Math.round((Date.now() - new Date(h.createdAt).getTime()) / DAY_MS))
      : 1;
    const rate = Math.round((totalLogged / createdDaysAgo) * 100);
    const doneToday = !!habitLogs[today];
    return `• "${h.name}" (${h.category}) — ${rate}% consistency, ${streak}-day streak, ${doneToday ? "✓ done today" : "✗ not done today"}`;
  });

  const summary =
    habitSummaries.length > 0
      ? habitSummaries.join("\n")
      : "No habits tracked yet.";

  return `You are a personal habit coach assistant embedded in the "Habit Tracker" app. You have real-time access to the user's habit data.

TODAY'S SNAPSHOT (${today}):
Total active habits: ${active.length}
Completed today: ${completedToday}/${active.length}

PER-HABIT DATA:
${summary}

YOUR ROLE:
- Give specific, actionable advice based on the actual numbers above.
- Keep responses concise (2-4 sentences max per point).
- Be warm and encouraging but data-driven.
- Never mention that you are an AI language model. You are their habit coach.`;
}

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        reply: "⚙️ GEMINI_API_KEY is not set. Add it to Vercel → Settings → Environment Variables.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { messages = [], habitContext = {} } = body;
  const systemPrompt = buildSystemPrompt(habitContext);

  const systemTurn = {
    role: "user",
    parts: [{ text: systemPrompt }],
  };
  const systemAck = {
    role: "model",
    parts: [{ text: "Understood. I'm ready to coach you based on your habit data." }],
  };

  const conversationTurns = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const contents = [systemTurn, systemAck, ...conversationTurns];

  const modelsToTry = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
  ];
  let lastError = null;
  let reply = null;

  for (const model of modelsToTry) {
    try {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 350,
            },
          }),
        }
      );

      const data = await geminiRes.json();

      if (geminiRes.ok && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        reply = data.candidates[0].content.parts[0].text;
        break;
      }

      if (data?.error?.message) {
        lastError = data.error.message;
      }
    } catch (e) {
      lastError = e.message;
    }
  }

  if (!reply) {
    return new Response(
      JSON.stringify({
        reply: `Sorry, unable to get response from Gemini (${lastError ?? "rate limit"}). Please try again in a few seconds.`,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(JSON.stringify({ reply }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
