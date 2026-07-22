import { useParams, Link } from "react-router-dom";
import { Topbar } from "../components/layout/Topbar";
import { Card } from "../components/ui/Card";
import { useHabits } from "../contexts/HabitsContext";
import { getBackground } from "../lib/backgrounds";

export function HabitDetails() {
  const { id } = useParams();
  const { habits, logs } = useHabits();
  const habit = habits.find((h) => h.id === id);

  if (!habit) {
    return (
      <>
        <Topbar title="Habit not found" />
        <div className="p-6">
          <Link to="/habits" className="text-foreground font-medium text-sm">Back to habits</Link>
        </div>
      </>
    );
  }

  const completedDays = Object.keys(logs[habit.id] ?? {}).length;
  const bg = getBackground(habit.background ?? "stadium");

  return (
    <>
      <Topbar title={habit.name} />
      <div className="p-6 space-y-4">
        {bg.url && (
          <div className="rounded-xl overflow-hidden h-40 border border-border">
            <img src={bg.url} alt={bg.label} className="w-full h-full object-cover" />
          </div>
        )}
        <Card>
          <p className="text-muted-foreground text-sm">{habit.description || "No description yet."}</p>
          <p className="text-sm mt-4">Completed days: {completedDays}</p>
        </Card>
      </div>
    </>
  );
}
