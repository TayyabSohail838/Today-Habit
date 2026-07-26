import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

/**
 * Wraps guest-only routes (/login, /register, /forgot-password).
 * If the user is already logged in, redirect them to /dashboard
 * so they don't land on login after a page refresh.
 */
export function GuestOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  // Wait for session to resolve before deciding
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}
