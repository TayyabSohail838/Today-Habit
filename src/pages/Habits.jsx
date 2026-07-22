import { useState } from "react";
import { Plus, Trash2, Archive, ArchiveRestore, Clock } from "lucide-react";
import { Topbar } from "../components/layout/Topbar";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { useHabits } from "../contexts/HabitsContext";
import { getBackground } from "../lib/backgrounds";

function formatTime(t) {
  if (!t) return null;
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

function HabitCard({ h, onArchive, onDelete }) {
  const bg = getBackground(h.background);

  return (
    <Card className={`p-0 overflow-hidden ${h.archived ? "opacity-60" : ""}`}>
      {/* Background banner */}
      {bg.url ? (
        <div className="relative h-24 overflow-hidden">
          <img
            src={bg.url}
            alt={bg.label}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      ) : (
        <div className="h-4 bg-gradient-to-r from-primary/20 to-primary/5" />
      )}

      {/* Card content */}
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{h.name}</h3>
            <p className="text-muted-foreground text-xs mt-1">
              {h.category} · {h.frequency}
              {h.archived && <span className="ml-2">· Archived</span>}
            </p>
            {h.reminderTime && (
              <p className="text-muted-foreground text-xs mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {formatTime(h.reminderTime)}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={onArchive} title={h.archived ? "Restore" : "Archive"}>
              {h.archived ? (
                <ArchiveRestore className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              ) : (
                <Archive className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              )}
            </button>
            <button onClick={onDelete} title="Delete">
              <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function Habits() {
  const { habits, removeHabit, toggleArchive, openAddHabit } = useHabits();
  const [showArchived, setShowArchived] = useState(false);

  const active = habits.filter((h) => !h.archived);
  const archived = habits.filter((h) => h.archived);
  const visible = showArchived ? archived : active;

  return (
    <>
      <Topbar title="Habits" />
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 text-sm">
            <button
              onClick={() => setShowArchived(false)}
              className={`px-3 py-1.5 rounded-full transition-colors ${!showArchived ? "bg-primary text-primary-foreground" : "text-muted-foreground bg-card border border-border"}`}
            >
              Active ({active.length})
            </button>
            <button
              onClick={() => setShowArchived(true)}
              className={`px-3 py-1.5 rounded-full transition-colors ${showArchived ? "bg-primary text-primary-foreground" : "text-muted-foreground bg-card border border-border"}`}
            >
              Archived ({archived.length})
            </button>
          </div>
          <Button onClick={openAddHabit} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> New habit
          </Button>
        </div>

        {visible.length === 0 ? (
          <Card>
            <EmptyState
              title={showArchived ? "No archived habits" : "No habits yet"}
              description={showArchived ? "Habits you archive will show up here." : "Create a habit to start tracking."}
            />
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((h) => (
              <HabitCard
                key={h.id}
                h={h}
                onArchive={() => toggleArchive(h.id, !h.archived)}
                onDelete={() => removeHabit(h.id)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
