// Shared stat calculations used by the Dashboard and AI Insights so the
// numbers stay consistent everywhere they're shown.

const DAY_MS = 24 * 60 * 60 * 1000;

function toDateOnly(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

// Consecutive days ending today (or yesterday, if today isn't done yet)
// that a single habit was marked complete.
export function currentStreakForHabit(habitLogs) {
  let streak = 0;
  let cursor = toDateOnly(new Date());
  while (habitLogs[dateKey(cursor)]) {
    streak += 1;
    cursor = new Date(cursor.getTime() - DAY_MS);
  }
  return streak;
}

// "Current Streak" card: the longest streak among all active habits.
export function longestCurrentStreak(habits, logs) {
  const active = (habits ?? []).filter((h) => !h.archived);
  if (!active.length) return 0;
  return Math.max(0, ...active.map((h) => currentStreakForHabit(logs[h.id] ?? {})));
}

// % of active habits completed on a given date.
function completionRateForDate(habits, logs, date) {
  const active = (habits ?? []).filter((h) => !h.archived);
  if (!active.length) return 0;
  const key = dateKey(date);
  const done = active.filter((h) => logs[h.id]?.[key]).length;
  return done / active.length;
}

// "Productivity Score": a 0-100 blend of today's completion rate (40%)
// and the 7-day rolling average completion rate (60%), so one bad or
// great day doesn't swing the number too hard but today still counts.
export function productivityScore(habits, logs) {
  const active = (habits ?? []).filter((h) => !h.archived);
  if (!active.length) return 0;

  const today = toDateOnly(new Date());
  return productivityScoreForDate(habits, logs, today);
}

// Same blend (40% that day + 60% trailing 7-day average ending that day),
// computed for an arbitrary date — used to build a daily history.
function productivityScoreForDate(habits, logs, date) {
  const active = (habits ?? []).filter((h) => !h.archived);
  if (!active.length) return 0;

  const dayRate = completionRateForDate(habits, logs, date);

  let sum = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(date.getTime() - i * DAY_MS);
    sum += completionRateForDate(habits, logs, d);
  }
  const weekAvg = sum / 7;

  const score = dayRate * 0.4 + weekAvg * 0.6;
  return Math.round(score * 100);
}

// Daily productivity score for each of the last `days` days (oldest
// first), for a trend chart. Each point uses the same formula as
// productivityScore(), just anchored to that day instead of today.
export function dailyProductivityScores(habits, logs, days = 14) {
  const today = toDateOnly(new Date());
  const points = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * DAY_MS);
    points.push({
      date: dateKey(d),
      label: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      score: productivityScoreForDate(habits, logs, d),
    });
  }
  return points;
}
