import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

export function Card({ className, children, ...props }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "bg-card/90 backdrop-blur-sm text-card-foreground rounded-xl shadow-sm p-6 border border-border",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
