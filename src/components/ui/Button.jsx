import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

const variants = {
  primary: "bg-primary text-primary-foreground hover:opacity-90",
  ghost: "bg-background text-foreground border border-border hover:bg-accent",
  outline: "bg-transparent text-foreground border border-border hover:bg-accent",
};

export function Button({ variant = "primary", className, children, ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.06, y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={cn(
        "px-4 py-2 rounded-xl font-medium text-sm shadow-sm transition-all duration-200 cursor-pointer",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
