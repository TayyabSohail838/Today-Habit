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
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "px-4 py-2 rounded-xl font-medium text-sm shadow-sm transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
