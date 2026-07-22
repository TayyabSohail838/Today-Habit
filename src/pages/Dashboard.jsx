import { useEffect, useState } from "react";
import { Flame, CheckCircle2, Sparkles } from "lucide-react";
import { Topbar } from "../components/layout/Topbar";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { useAuth } from "../contexts/AuthContext";
import { useHabits } from "../contexts/HabitsContext";
import { generateInsights, getMotivationalQuote } from "../services/aiService";
import { longestCurrentStreak, productivityScore } from "../lib/habitStats";
import { ProgressRing } from "../components/features/dashboard/ProgressRing";
import { HabitHeatmap } from "../components/features/dashboard/HabitHeatmap";

export function Dashboard() {
  const { user } = useAuth();
  const { habits, logs, toggleCompletion } = useHabits();
  const [insights, setInsights] = useState([]);
  const [quote, setQuote] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  const todaysHabits = habits.filter((h) => !h.archived);
  const completedToday = todaysHabits.filter((h) => logs[h.id]?.[today]).length;
  const streak = longestCurrentStreak(habits, logs);
  const score = productivityScore(habits, logs);
  const completionRate = todaysHabits.length ? Math.round((completedToday / todaysHabits.length) * 100) : 0;

  useEffect(() => {
    generateInsights({ habits, logs }).then(setInsights);
    getMotivationalQuote().then(setQuote);
  }, [habits, logs]);

  return (
    <>
      <Topbar title={`Welcome back${user?.name ? ", " + user.name : ""}`} />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-1 flex flex-col items-center justify-center">
            <ProgressRing value={completionRate} label="Today's Progress" />
            <p className="text-sm text-muted-foreground mt-2">
              {completedToday}/{todaysHabits.length || 0} habits done
            </p>
          </Card>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <Flame className="w-5 h-5 text-warning mb-2" />
              <p className="text-muted-foreground text-sm">Current Streak</p>
              <p className="text-2xl font-semibold">{streak} day{streak === 1 ? "" : "s"}</p>
            </Card>
            <Card>
              <Sparkles className="w-5 h-5 text-primary mb-2" />
              <p className="text-muted-foreground text-sm">Productivity Score</p>
              <p className="text-2xl font-semibold">{score}</p>
            </Card>
          </div>
        </div>

        <Card>
          <h2 className="font-semibold mb-1">Habit Heatmap</h2>
          <p className="text-muted-foreground text-sm mb-4">Last 12 weeks of activity across all habits.</p>
          <HabitHeatmap habits={habits} logs={logs} weeks={12} />
        </Card>

        <Card>
          <h2 className="font-semibold mb-4">Today's Habits</h2>
          {todaysHabits.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="No habits yet"
              description="Use the + button to create your first habit."
            />
          ) : (
            <ul className="space-y-2">
              {todaysHabits.map((h) => (
                <li key={h.id} className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-accent">
                  <span className="text-sm">{h.name}</span>
                  <button
                    onClick={() => toggleCompletion(h.id, today)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                      logs[h.id]?.[today]
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {logs[h.id]?.[today] ? "Done" : "Mark done"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <h2 className="font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> AI Recommendation
            </h2>
            <ul className="text-sm text-muted-foreground space-y-2">
              {insights.map((i) => (
                <li key={i.id}>{i.message}</li>
              ))}
            </ul>
          </Card>
          <Card>
            <h2 className="font-semibold mb-2">Motivational Quote</h2>
            <p className="text-sm text-muted-foreground italic">"{quote}"</p>
          </Card>
        </div>
      </div>
    </>
  );
}
