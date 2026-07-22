import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useHabits } from "../../contexts/HabitsContext";

export function FloatingActionButton() {
  const { openAddHabit } = useHabits();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="fixed bottom-8 right-8 z-40 flex items-center gap-3"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.15 }}
            className="order-first px-3 py-1.5 rounded-lg bg-popover text-popover-foreground border border-border text-sm shadow-md whitespace-nowrap"
          >
            New habit
          </motion.span>
        )}
      </AnimatePresence>

      <motion.button
        onClick={openAddHabit}
        aria-label="New habit"
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
        animate={{ boxShadow: ["0 0 0 0 rgba(22,163,74,0.35)", "0 0 0 12px rgba(22,163,74,0)"] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
