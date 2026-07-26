import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useHabits } from "../../contexts/HabitsContext";
import { getBackground } from "../../lib/backgrounds";
import { readKey } from "../../lib/storage";

const PAGE_BG_KEY = "habit-tracker:page-background";

// Sitewide ambient background: a large, blurred, low-opacity photo behind
// every page. Priority order:
//   1. /habits/:id  → that habit's chosen background
//   2. /habits list → first active habit's background (if any)
//   3. Anywhere else → user's chosen page background (from Settings)
//   4. Default: stadium
export function AppBackground() {
  const location = useLocation();
  const { habits } = useHabits();
  const [pageBg, setPageBg] = useState(() => readKey(PAGE_BG_KEY, "stadium"));

  // Re-read from storage when Settings saves a new choice
  useEffect(() => {
    const onStorage = () => setPageBg(readKey(PAGE_BG_KEY, "stadium"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Priority 1: habit detail page
  const detailMatch = location.pathname.match(/\/habits\/([^/]+)/);
  const detailHabit = detailMatch ? habits.find((h) => h.id === detailMatch[1]) : null;

  // Priority 2: habits list page — show first active habit's bg
  const isHabitsListPage = location.pathname === "/habits";
  const firstActiveHabit = isHabitsListPage
    ? habits.find((h) => !h.archived && h.background && h.background !== "none")
    : null;

  const activeHabit = detailHabit ?? firstActiveHabit ?? null;
  const bgId = activeHabit?.background ?? pageBg ?? "stadium";
  const bg = getBackground(bgId);

  if (!bg.url) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <img
        src={bg.url}
        alt=""
        className="w-full h-full object-cover blur-sm scale-110 opacity-[0.35] dark:opacity-[0.45]"
      />
      <div className="absolute inset-0 bg-background/55 dark:bg-background/60" />
    </div>
  );
}
