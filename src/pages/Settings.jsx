import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Topbar } from "../components/layout/Topbar";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { BACKGROUNDS } from "../lib/backgrounds";
import { readKey, writeKey } from "../lib/storage";

const PAGE_BG_KEY = "habit-tracker:page-background";

export function Settings() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [pageBg, setPageBg] = useState(() => readKey(PAGE_BG_KEY, "stadium"));

  const handlePageBgChange = (id) => {
    setPageBg(id);
    writeKey(PAGE_BG_KEY, id);
    // Force background re-render across the app
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <>
      <Topbar title="Settings" />
      <div className="p-6 space-y-4 max-w-lg">

        {/* Account */}
        <Card>
          <h2 className="font-semibold mb-2">Account</h2>
          <p className="text-sm">{user?.name}</p>
          <p className="text-muted-foreground text-sm">{user?.email}</p>
        </Card>

        {/* Appearance */}
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

        {/* Page Background */}
        <Card>
          <h2 className="font-semibold mb-1">Page Background</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Choose a default background for Dashboard, Statistics, and other pages.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {BACKGROUNDS.map((bg) => (
              <button
                key={bg.id}
                onClick={() => handlePageBgChange(bg.id)}
                className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all duration-200 cursor-pointer focus:outline-none ${
                  pageBg === bg.id
                    ? "border-primary shadow-lg shadow-primary/25 scale-[1.03]"
                    : "border-transparent hover:border-border hover:scale-[1.02]"
                }`}
                title={bg.label}
              >
                {bg.url ? (
                  <img
                    src={bg.url}
                    alt={bg.label}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground text-xs font-medium">None</span>
                  </div>
                )}
                {/* Label overlay */}
                <div className="absolute bottom-0 inset-x-0 bg-black/60 px-1.5 py-1">
                  <p className="text-white text-[10px] font-medium truncate leading-tight">{bg.label}</p>
                </div>
                {/* Selected checkmark */}
                {pageBg === bg.id && (
                  <div className="absolute top-1.5 right-1.5">
                    <CheckCircle2 className="w-4 h-4 text-primary fill-white" />
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
