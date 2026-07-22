import { useLocation } from "react-router-dom";
import { useHabits } from "../../contexts/HabitsContext";
import { getBackground } from "../../lib/backgrounds";

// Sitewide ambient background: shows a large, blurred, low-opacity photo
// behind every page so the app never feels like a flat white dashboard.
//
// Route-aware logic:
//   /habits/:id  → that habit's chosen background
//   other pages  → the user's global background preference (default: stadium)
//   "none"       → no background image at all
export function AppBackground() {
  const location = useLocation();
  const { habits, globalBackground } = useHabits();

  // Check if we're on a habit detail page
  const match = location.pathname.match(/\/habits\/([^/]+)/);
  const habit = match ? habits.find((h) => h.id === match[1]) : null;

  // Determine which background to use
  const bgId = habit?.background ?? globalBackground ?? "stadium";
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

