import { readKey, writeKey } from "../lib/storage";

const HABITS_KEY = "habit-tracker:habits";
const LOGS_KEY = "habit-tracker:logs"; // { [habitId]: { [dateISO]: true } }

// Every function here is the seam where a future Supabase-backed
// implementation (profiles / habits / habit_logs tables + RLS) would
// slot in. Callers (hooks, pages) should not need to change.

export function getHabits() {
  return readKey(HABITS_KEY, []);
}

export function saveHabits(habits) {
  writeKey(HABITS_KEY, habits);
}

export function createHabit(habit) {
  const habits = getHabits();
  const newHabit = {
    id: crypto.randomUUID(),
    name: habit.name,
    description: habit.description ?? "",
    category: habit.category ?? "General",
    color: habit.color ?? "#4C6FFF",
    icon: habit.icon ?? "Sparkles",
    priority: habit.priority ?? "medium",
    reminderTime: habit.reminderTime ?? null,
    frequency: habit.frequency ?? "daily", // daily | weekly | monthly | custom
    background: habit.background ?? "stadium",
    archived: false,
    createdAt: new Date().toISOString(),
  };
  saveHabits([...habits, newHabit]);
  return newHabit;
}

export function updateHabit(id, patch) {
  const habits = getHabits().map((h) => (h.id === id ? { ...h, ...patch } : h));
  saveHabits(habits);
}

export function deleteHabit(id) {
  saveHabits(getHabits().filter((h) => h.id !== id));
}

export function archiveHabit(id, archived = true) {
  updateHabit(id, { archived });
}

export function getLogs() {
  return readKey(LOGS_KEY, {});
}

export function toggleCompletion(habitId, dateISO = new Date().toISOString().slice(0, 10)) {
  const logs = getLogs();
  const habitLogs = { ...(logs[habitId] ?? {}) };
  if (habitLogs[dateISO]) {
    delete habitLogs[dateISO];
  } else {
    habitLogs[dateISO] = true;
  }
  const next = { ...logs, [habitId]: habitLogs };
  writeKey(LOGS_KEY, next);
  return next;
}

export function isCompleted(habitId, dateISO = new Date().toISOString().slice(0, 10)) {
  const logs = getLogs();
  return Boolean(logs[habitId]?.[dateISO]);
}
