import { cn } from "../../lib/cn";

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring focus:border-ring placeholder:text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}
