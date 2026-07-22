import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import * as habitsService from "../services/habitsService";

const HabitsContext = createContext(null);

export function HabitsProvider({ children }) {
  const { user, updateGlobalBackground } = useAuth();

  const [habits, setHabits]   = useState([]);
  const [logs, setLogs]       = useState({});
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Global background is now stored in the profiles table via AuthContext.
  // We read it from user.globalBackground and write via authService.updateProfile.
  const globalBackground = user?.globalBackground ?? "stadium";

  // ----------------------------------------------------------------
  // Data loading — refetch whenever the logged-in user changes
  // ----------------------------------------------------------------
  const refresh = useCallback(async () => {
    if (!user?.id) {
      setHabits([]);
      setLogs({});
      return;
    }
    const [fetchedHabits, fetchedLogs] = await Promise.all([
      habitsService.getHabits(user.id),
      habitsService.getLogs(user.id),
    ]);
    setHabits(fetchedHabits);
    setLogs(fetchedLogs);
  }, [user?.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // ----------------------------------------------------------------
  // Habit CRUD
  // ----------------------------------------------------------------
  const addHabit = async (habit) => {
    await habitsService.createHabit(user.id, habit);
    await refresh();
  };

  const editHabit = async (id, patch) => {
    await habitsService.updateHabit(id, patch);
    await refresh();
  };

  const removeHabit = async (id) => {
    await habitsService.deleteHabit(id);
    await refresh();
  };

  const toggleArchive = async (id, archived) => {
    await habitsService.archiveHabit(id, archived);
    await refresh();
  };

  // ----------------------------------------------------------------
  // Log toggle
  // ----------------------------------------------------------------
  const toggleCompletion = async (id, dateISO) => {
    await habitsService.toggleCompletion(id, user.id, dateISO);
    await refresh();
  };

  // ----------------------------------------------------------------
  // Global background preference (stored in profiles table via AuthContext)
  // ----------------------------------------------------------------
  const setGlobalBackground = async (bgId) => {
    await updateGlobalBackground(bgId);
  };

  // ----------------------------------------------------------------
  // Modal state
  // ----------------------------------------------------------------
  const openAddHabit  = () => setIsAddOpen(true);
  const closeAddHabit = () => setIsAddOpen(false);

  return (
    <HabitsContext.Provider
      value={{
        habits,
        logs,
        addHabit,
        editHabit,
        removeHabit,
        toggleArchive,
        toggleCompletion,
        refresh,
        isAddOpen,
        openAddHabit,
        closeAddHabit,
        globalBackground,
        setGlobalBackground,
      }}
    >
      {children}
    </HabitsContext.Provider>
  );
}

export function useHabits() {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error("useHabits must be used within HabitsProvider");
  return ctx;
}
