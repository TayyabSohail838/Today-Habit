import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Topbar } from "../components/layout/Topbar";
import { Card } from "../components/ui/Card";
import { useHabits } from "../contexts/HabitsContext";
import { useTheme } from "../contexts/ThemeContext";
import { dailyProductivityScores } from "../lib/habitStats";

export function Statistics() {
  const { habits, logs } = useHabits();
  const { theme } = useTheme();
  const axisColor = theme === "dark" ? "#a1a8bb" : "#64748b";
  const lineColor = theme === "dark" ? "#e5e7eb" : "#111827";

  const barData = habits.map((h) => ({
    name: h.name.slice(0, 10),
    completed: Object.keys(logs[h.id] ?? {}).length,
  }));

  const productivityData = dailyProductivityScores(habits, logs, 14);

  return (
    <>
      <Topbar title="Statistics" />
      <div className="p-6 space-y-4">
        <Card>
          <h2 className="font-semibold mb-1">Productivity Score — last 14 days</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Each point blends that day's completion rate (40%) with your 7-day trailing average (60%).
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={productivityData}>
              <XAxis dataKey="label" fontSize={12} stroke={axisColor} interval={1} />
              <YAxis domain={[0, 100]} fontSize={12} stroke={axisColor} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#16A34A" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <h2 className="font-semibold mb-4">Completion by Habit</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData}>
                <XAxis dataKey="name" fontSize={12} stroke={axisColor} />
                <YAxis allowDecimals={false} fontSize={12} stroke={axisColor} />
                <Tooltip />
                <Bar dataKey="completed" fill={lineColor} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card>
            <h2 className="font-semibold mb-4">Trend</h2>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={barData}>
                <XAxis dataKey="name" fontSize={12} stroke={axisColor} />
                <YAxis allowDecimals={false} fontSize={12} stroke={axisColor} />
                <Tooltip />
                <Line type="monotone" dataKey="completed" stroke="#16A34A" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </>
  );
}
