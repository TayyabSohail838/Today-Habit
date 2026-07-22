import { ThemeToggle } from "../ui/ThemeToggle";

export function Topbar({ title }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/70 backdrop-blur sticky top-0 z-10">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      <ThemeToggle />
    </header>
  );
}
