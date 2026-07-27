import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

export function Card({ className, children, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      whileHover={{ y: -3, transition: { duration: 0.15, ease: "easeOut" } }}
      transition={{ duration: 0.3, ease: "easeOut" }}
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
