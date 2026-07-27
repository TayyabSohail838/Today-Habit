import { NavLink } from "react-router-dom";
import { LayoutDashboard, ListChecks, BarChart3, Sparkles, Settings, LogOut } from "lucide-react";
import { cn } from "../../lib/cn";
import { useAuth } from "../../contexts/AuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/habits", label: "Habits", icon: ListChecks },
  { to: "/statistics", label: "Statistics", icon: BarChart3 },
  { to: "/ai-insights", label: "AI Insights", icon: Sparkles },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const { user, logout } = useAuth() || {};

  return (
    <aside className="w-60 shrink-0 bg-card/80 backdrop-blur-md border-r border-border min-h-screen p-4 hidden md:flex md:flex-col justify-between">
      <div className="flex flex-col gap-1">
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
      </div>

      {user && (
        <div className="pt-4 border-t border-border mt-auto flex items-center justify-between px-2">
          <div className="min-w-0 flex-1 mr-2">
            <p className="text-xs font-semibold text-foreground truncate">{user.name || "User"}</p>
            <p className="text-[11px] text-muted-foreground truncate">{user.email || ""}</p>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-accent transition-colors cursor-pointer flex items-center justify-center"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </aside>
  );
}
