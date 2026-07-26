import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, Archive, ArchiveRestore, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Topbar } from "../components/layout/Topbar";
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
  const bg = getBackground(h.background ?? "none");

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={`relative rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-shadow ${
        h.archived ? "opacity-60" : ""
      }`}
    >
      {/* Background image */}
      {bg.url ? (
        <>
          <img
            src={bg.url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/50" />
        </>
      ) : (
        <div className="absolute inset-0 bg-card" />
      )}

      {/* Content */}
      <Link to={`/habits/${h.id}`} className="relative block p-5 z-10">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className={`font-bold text-lg truncate ${bg.url ? "text-white" : "text-foreground"}`}>
              {h.name}
            </h3>
            <p className={`text-xs mt-1 ${bg.url ? "text-white/70" : "text-muted-foreground"}`}>
              {h.category} · {h.frequency}
              {h.archived && <span className="ml-2">· Archived</span>}
            </p>
            {h.reminderTime && (
              <p className={`text-xs mt-1.5 flex items-center gap-1 ${bg.url ? "text-white/70" : "text-muted-foreground"}`}>
                <Clock className="w-3 h-3" />
                {formatTime(h.reminderTime)}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 ml-3 z-20" onClick={(e) => e.preventDefault()}>
            <button
              onClick={(e) => { e.preventDefault(); onArchive(); }}
              title={h.archived ? "Restore" : "Archive"}
              className="p-1.5 rounded-lg bg-black/30 hover:bg-black/50 transition-colors"
            >
              {h.archived ? (
                <ArchiveRestore className="w-4 h-4 text-white" />
              ) : (
                <Archive className="w-4 h-4 text-white" />
              )}
            </button>
            <button
              onClick={(e) => { e.preventDefault(); onDelete(); }}
              title="Delete"
              className="p-1.5 rounded-lg bg-black/30 hover:bg-red-500/60 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
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
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8">
            <EmptyState
              title={showArchived ? "No archived habits" : "No habits yet"}
              description={showArchived ? "Habits you archive will show up here." : "Create a habit to start tracking."}
            />
          </div>
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
