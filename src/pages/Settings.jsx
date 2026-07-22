import { Topbar } from "../components/layout/Topbar";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useHabits } from "../contexts/HabitsContext";
import { BACKGROUNDS } from "../lib/backgrounds";

export function Settings() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { globalBackground, setGlobalBackground } = useHabits();

  return (
    <>
      <Topbar title="Settings" />
      <div className="p-6 space-y-4 max-w-2xl">
        <Card>
          <h2 className="font-semibold mb-2">Account</h2>
          <p className="text-sm">{user?.name}</p>
          <p className="text-muted-foreground text-sm">{user?.email}</p>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Appearance</h2>
              <p className="text-muted-foreground text-sm">Currently using {theme} mode</p>
            </div>
            <Button variant="outline" onClick={toggleTheme}>
              Switch to {theme === "dark" ? "light" : "dark"}
            </Button>
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold mb-1">Page Background</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Choose a default background for Dashboard, Statistics, and other pages.
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {BACKGROUNDS.map((bg) => (
              <button
                type="button"
                key={bg.id}
                onClick={() => setGlobalBackground(bg.id)}
                className={`relative rounded-xl overflow-hidden h-20 border-2 transition-all duration-200 group ${
                  globalBackground === bg.id
                    ? "border-primary ring-2 ring-primary/30 scale-[1.02]"
                    : "border-transparent hover:border-muted-foreground/30"
                }`}
                title={bg.label}
              >
                {bg.url ? (
                  <img
                    src={bg.url}
                    alt={bg.label}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-xs text-muted-foreground font-medium">None</span>
                  </div>
                )}
                <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-1.5 py-1 truncate text-center">
                  {bg.label}
                </span>
                {globalBackground === bg.id && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </Card>
        <Button variant="ghost" onClick={logout}>Log out</Button>
      </div>
    </>
  );
}
