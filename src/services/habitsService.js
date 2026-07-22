// Habits + logs data layer — all reads/writes go through Supabase.
// The public API (function names, return shapes) is kept identical
// to the old localStorage version so HabitsContext needs minimal changes.
//
// Logs shape returned by getLogs():
//   { [habitId]: { [dateISO]: true } }
// This matches what Dashboard/Statistics/AIInsights expect.

import { supabase } from "../lib/supabase";

// ----------------------------------------------------------------
// Habits
// ----------------------------------------------------------------

/**
 * Fetch all habits for the given user (active + archived).
 * Returned array matches the shape expected by HabitsContext.
 */
export async function getHabits(userId) {
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  // Map snake_case DB columns → camelCase app shape
  return (data ?? []).map(dbHabitToApp);
}

/**
 * Create a new habit row and return it.
 */
export async function createHabit(userId, habit) {
  const { data, error } = await supabase
    .from("habits")
    .insert({
      user_id:       userId,
      name:          habit.name,
      description:   habit.description ?? "",
      category:      habit.category ?? "General",
      color:         habit.color ?? "#4C6FFF",
      icon:          habit.icon ?? "Sparkles",
      priority:      habit.priority ?? "medium",
      reminder_time: habit.reminderTime ?? null,
      frequency:     habit.frequency ?? "daily",
      background:    habit.background ?? "stadium",
      archived:      false,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return dbHabitToApp(data);
}

/**
 * Apply a partial update to a habit row.
 * `patch` uses camelCase app keys — converted to snake_case here.
 */
export async function updateHabit(id, patch) {
  const { error } = await supabase
    .from("habits")
    .update(appPatchToDb(patch))
    .eq("id", id);

  if (error) throw new Error(error.message);
}

/**
 * Hard-delete a habit (habit_logs cascade automatically).
 */
export async function deleteHabit(id) {
  const { error } = await supabase
    .from("habits")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}

/**
 * Archive or restore a habit.
 */
export async function archiveHabit(id, archived = true) {
  return updateHabit(id, { archived });
}

// ----------------------------------------------------------------
// Logs
// ----------------------------------------------------------------

/**
 * Fetch all logs for the given user and reshape into:
 *   { [habitId]: { [dateISO]: true } }
 */
export async function getLogs(userId) {
  const { data, error } = await supabase
    .from("habit_logs")
    .select("habit_id, date")
    .eq("user_id", userId);

  if (error) throw new Error(error.message);

  // Reshape rows → nested map
  const logs = {};
  for (const row of data ?? []) {
    if (!logs[row.habit_id]) logs[row.habit_id] = {};
    logs[row.habit_id][row.date] = true;
  }
  return logs;
}

/**
 * Toggle a log entry: insert if missing, delete if present.
 * Returns the updated logs map for the given user.
 */
export async function toggleCompletion(habitId, userId, dateISO) {
  // Check if the log exists
  const { data: existing } = await supabase
    .from("habit_logs")
    .select("id")
    .eq("habit_id", habitId)
    .eq("date", dateISO)
    .maybeSingle();

  if (existing) {
    // Already logged — delete it (toggle off)
    const { error } = await supabase
      .from("habit_logs")
      .delete()
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    // Not logged — insert it (toggle on)
    const { error } = await supabase
      .from("habit_logs")
      .insert({ habit_id: habitId, user_id: userId, date: dateISO });
    if (error) throw new Error(error.message);
  }
}

// ----------------------------------------------------------------
// Shape converters
// ----------------------------------------------------------------

function dbHabitToApp(row) {
  return {
    id:           row.id,
    userId:       row.user_id,
    name:         row.name,
    description:  row.description,
    category:     row.category,
    color:        row.color,
    icon:         row.icon,
    priority:     row.priority,
    reminderTime: row.reminder_time,
    frequency:    row.frequency,
    background:   row.background,
    archived:     row.archived,
    createdAt:    row.created_at,
  };
}

function appPatchToDb(patch) {
  const map = {
    name:         "name",
    description:  "description",
    category:     "category",
    color:        "color",
    icon:         "icon",
    priority:     "priority",
    reminderTime: "reminder_time",
    frequency:    "frequency",
    background:   "background",
    archived:     "archived",
  };
  const db = {};
  for (const [appKey, dbKey] of Object.entries(map)) {
    if (appKey in patch) db[dbKey] = patch[appKey];
  }
  return db;
}
