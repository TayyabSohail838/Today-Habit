import { NavLink } from "react-router-dom";
import { LayoutDashboard, ListChecks, BarChart3, Sparkles, Settings } from "lucide-react";
import { cn } from "../../lib/cn";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/habits", label: "Habits", icon: ListChecks },
  { to: "/statistics", label: "Statistics", icon: BarChart3 },
  { to: "/ai-insights", label: "AI Insights", icon: Sparkles },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="w-60 shrink-0 bg-card/80 backdrop-blur-md border-r border-border min-h-screen p-4 hidden md:flex md:flex-col gap-1">
      <div className="px-2 py-4 font-semibold text-lg text-foreground">Habit Tracker</div>
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
              isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )
          }
        >
          <Icon className="w-4 h-4" />
          {label}
        </NavLink>
      ))}
    </aside>
  );
}
