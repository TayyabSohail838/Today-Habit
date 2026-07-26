import { createContext, useContext, useState, useCallback } from "react";
import * as habitsService from "../services/habitsService";

const HabitsContext = createContext(null);

export function HabitsProvider({ children }) {
  const [habits, setHabits] = useState(() => habitsService.getHabits());
  const [logs, setLogs] = useState(() => habitsService.getLogs());
  const [isAddOpen, setIsAddOpen] = useState(false);

  const openAddHabit = () => setIsAddOpen(true);
  const closeAddHabit = () => setIsAddOpen(false);

  const refresh = useCallback(() => {
    setHabits(habitsService.getHabits());
    setLogs(habitsService.getLogs());
  }, []);

  const addHabit = (habit) => {
    habitsService.createHabit(habit);
    refresh();
  };

  const editHabit = (id, patch) => {
    habitsService.updateHabit(id, patch);
    refresh();
  };

  const removeHabit = (id) => {
    habitsService.deleteHabit(id);
    refresh();
  };

  const toggleArchive = (id, archived) => {
    habitsService.archiveHabit(id, archived);
    refresh();
  };

  const toggleCompletion = (id, dateISO) => {
    habitsService.toggleCompletion(id, dateISO);
    refresh();
  };

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
