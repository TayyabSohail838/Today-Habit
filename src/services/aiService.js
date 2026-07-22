// Service layer for AI-generated insights. Today this computes real
// heuristics locally from habit/log data (streaks, consistency %,
// weekday vs weekend patterns). Later, swap the body of
// generateInsights() for a call to an OpenAI/Gemini endpoint — the
// return shape (array of { id, type, message }) should stay the same
// so Dashboard / AIInsights don't need to change.

import { currentStreakForHabit } from "../lib/habitStats";

const DAY_MS = 24 * 60 * 60 * 1000;

function daysBetween(a, b) {
  return Math.max(1, Math.round((b - a) / DAY_MS));
}

function weekendVsWeekday(habitLogs) {
  let weekendDone = 0, weekendTotal = 0, weekdayDone = 0, weekdayTotal = 0;
  Object.keys(habitLogs).forEach((dateStr) => {
    const day = new Date(dateStr).getDay();
    const isWeekend = day === 0 || day === 6;
    if (isWeekend) { weekendTotal++; if (habitLogs[dateStr]) weekendDone++; }
    else { weekdayTotal++; if (habitLogs[dateStr]) weekdayDone++; }
  });
  return { weekendDone, weekendTotal, weekdayDone, weekdayTotal };
}

export async function generateInsights({ habits, logs }) {
  const active = (habits ?? []).filter((h) => !h.archived);

  if (!active.length) {
    return [
      {
        id: "empty",
        type: "motivation",
        message: "Add your first habit to start getting personalized insights.",
      },
    ];
  }

  const insights = [];
  const today = new Date();

  for (const habit of active) {
    const habitLogs = logs[habit.id] ?? {};
    const completedDays = Object.keys(habitLogs).length;

    if (completedDays === 0) {
      insights.push({
        id: `new-${habit.id}`,
        type: "motivation",
        message: `You haven't logged "${habit.name}" yet — mark it done once to start building a streak.`,
      });
      continue;
    }

    const createdAt = habit.createdAt ? new Date(habit.createdAt) : today;
    const totalDays = daysBetween(createdAt, today);
    const rate = Math.round((completedDays / totalDays) * 100);
    const streak = currentStreakForHabit(habitLogs);

    insights.push({
      id: `rate-${habit.id}`,
      type: "consistency",
      message: `You complete "${habit.name}" about ${rate}% of the time (${completedDays}/${totalDays} days since you added it).`,
    });

    if (streak >= 2) {
      insights.push({
        id: `streak-${habit.id}`,
        type: "streak",
        message: `You're on a ${streak}-day streak for "${habit.name}" — keep it going!`,
      });
    }

    const { weekendDone, weekendTotal, weekdayDone, weekdayTotal } = weekendVsWeekday(habitLogs);
    if (weekendTotal >= 2 && weekdayTotal >= 2) {
      const weekendRate = weekendDone / weekendTotal;
      const weekdayRate = weekdayDone / weekdayTotal;
      if (weekdayRate - weekendRate >= 0.25) {
        insights.push({
          id: `weekend-${habit.id}`,
          type: "pattern",
          message: `You tend to skip "${habit.name}" on weekends. Consider setting a lighter weekend version of it.`,
        });
      } else if (weekendRate - weekdayRate >= 0.25) {
        insights.push({
          id: `weekday-${habit.id}`,
          type: "pattern",
          message: `You're more consistent with "${habit.name}" on weekends than on weekdays.`,
        });
      }
    }
  }

  return insights.slice(0, 6);
}

export async function getMotivationalQuote() {
  const quotes = [
    "Small daily improvements lead to staggering long-term results.",
    "You don't have to be great to start, but you have to start to be great.",
    "Discipline is choosing between what you want now and what you want most.",
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
}
