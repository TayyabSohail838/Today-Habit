import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'api-chat-dev-server',
        configureServer(server) {
          server.middlewares.use('/api/chat', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end(JSON.stringify({ error: 'Method not allowed' }));
              return;
            }

            let bodyStr = '';
            req.on('data', (chunk) => { bodyStr += chunk; });
            req.on('end', async () => {
              try {
                const body = JSON.parse(bodyStr || '{}');
                const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

                if (!apiKey) {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    reply: "⚙️ Gemini API Key is missing! Get a free key at https://aistudio.google.com/apikey and add GEMINI_API_KEY=your_key in your .env file, then restart the dev server."
                  }));
                  return;
                }

                const { messages = [] } = body;

                // Build full conversation for Gemini
                const conversationTurns = messages.map((m) => ({
                  role: m.role === 'assistant' ? 'model' : 'user',
                  parts: [{ text: m.content }],
                }));

                // System prompt injected as first turn
                const systemTurn = {
                  role: 'user',
                  parts: [{ text: `You are a friendly AI habit coach embedded in a Habit Tracker web app. Give concise, warm, and actionable advice on building habits, staying consistent, improving streaks, and productivity. Keep answers short (2-4 sentences). Never mention being an AI.` }],
                };
                const systemAck = {
                  role: 'model',
                  parts: [{ text: 'Understood! I am your personal habit coach, ready to help.' }],
                };

                const contents = [systemTurn, systemAck, ...conversationTurns];

                // Try free-tier models in order (lite first = most quota)
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
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          contents,
                          generationConfig: { temperature: 0.7, maxOutputTokens: 300 },
                        }),
                      }
                    );

                    const data = await geminiRes.json();

                    if (geminiRes.ok && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
                      reply = data.candidates[0].content.parts[0].text;
                      break; // Success!
                    }

                    if (data?.error?.message) {
                      lastError = data.error.message;
                    }
                  } catch (e) {
                    lastError = e.message;
                  }
                }

                if (!reply) {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    reply: `Sorry, unable to get response from Gemini API (${lastError ?? "quota limit"}). Please try again in a few seconds.`
                  }));
                  return;
                }

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ reply }));
              } catch (err) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ reply: `Server error: ${err.message}` }));
              }
            });
          });
        }
      }
    ],
    base: '/',
  };
});
