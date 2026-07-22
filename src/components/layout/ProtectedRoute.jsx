import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// Shows a loading spinner while the Supabase session is being resolved
// on the initial page load. Without this, users would be briefly redirected
// to /login on every page refresh even when they're actually logged in.
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

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

  if (!user) return <Navigate to="/login" replace />;
  return children;
}
