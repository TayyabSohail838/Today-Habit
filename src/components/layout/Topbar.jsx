import { ThemeToggle } from "../ui/ThemeToggle";

export function Topbar({ title }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/70 backdrop-blur sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <img src="/favicon.svg" alt="Habit Tracker logo" className="h-8 w-8 rounded-md" />
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>
      <ThemeToggle />
    </header>
  );
}
