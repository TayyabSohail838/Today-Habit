import { useState } from "react";
import { Modal } from "../../ui/Modal";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { useHabits } from "../../../contexts/HabitsContext";
import { BACKGROUNDS } from "../../../lib/backgrounds";

const frequencies = ["daily", "weekly", "monthly", "custom"];

export function AddHabitModal() {
  const { isAddOpen, closeAddHabit, addHabit } = useHabits();
  const [name, setName] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [background, setBackground] = useState("stadium");

  const reset = () => {
    setName("");
    setReminderTime("");
    setFrequency("daily");
    setBackground("stadium");
  };

  const onCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addHabit({
      name,
      reminderTime: reminderTime || null,
      frequency,
      background,
    });
    reset();
    closeAddHabit();
  };

  const onClose = () => {
    reset();
    closeAddHabit();
  };

  return (
    <Modal open={isAddOpen} onClose={onClose}>
      <h2 className="font-semibold text-foreground mb-4">New habit</h2>
      <form onSubmit={onCreate} className="space-y-3">
        <Input placeholder="Habit name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Reminder time</label>
          <Input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Frequency</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-ring focus:border-ring"
          >
            {frequencies.map((f) => (
              <option key={f} value={f}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2">Background</label>
          <div className="grid grid-cols-3 gap-2">
            {BACKGROUNDS.map((bg) => (
              <button
                type="button"
                key={bg.id}
                onClick={() => setBackground(bg.id)}
                className={`relative rounded-lg overflow-hidden h-14 border-2 transition-colors ${
                  background === bg.id ? "border-primary" : "border-transparent"
                }`}
                title={bg.label}
              >
                {bg.url ? (
                  <img src={bg.url} alt={bg.label} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
                    None
                  </div>
                )}
                <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] px-1 py-0.5 truncate">
                  {bg.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full">Create</Button>
      </form>
    </Modal>
  );
}
