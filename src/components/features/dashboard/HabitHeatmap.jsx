import { motion } from "framer-motion";

const DAY_MS = 24 * 60 * 60 * 1000;

function toDateOnly(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

function levelFor(count, max) {
  if (count === 0) return 0;
  const ratio = count / Math.max(1, max);
  if (ratio > 0.75) return 4;
  if (ratio > 0.5) return 3;
  if (ratio > 0.25) return 2;
  return 1;
}

const levelClasses = [
  "bg-muted",
  "bg-primary/25",
  "bg-primary/50",
  "bg-primary/75",
  "bg-primary",
];

// GitHub-style heatmap: one column per week, going back `weeks` weeks.
export function HabitHeatmap({ habits, logs, weeks = 12 }) {
  const active = (habits ?? []).filter((h) => !h.archived);
  const today = toDateOnly(new Date());
  const totalDays = weeks * 7;

  const days = [];
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * DAY_MS);
    const key = dateKey(d);
    const count = active.filter((h) => logs[h.id]?.[key]).length;
    days.push({ date: d, key, count });
  }

  const maxCount = Math.max(1, ...days.map((d) => d.count));
  const columns = [];
  for (let i = 0; i < days.length; i += 7) {
    columns.push(days.slice(i, i + 7));
  }

  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {columns.map((col, ci) => (
        <div key={ci} className="flex flex-col gap-1">
          {col.map((d) => (
            <motion.div
              key={d.key}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15 }}
              title={`${d.key}: ${d.count} habit${d.count === 1 ? "" : "s"} completed`}
              className={`w-3 h-3 rounded-sm ${levelClasses[levelFor(d.count, maxCount)]}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
