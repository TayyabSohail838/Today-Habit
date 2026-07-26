import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/Button";

export function NotFound() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
      <div className="text-center space-y-6 max-w-md">
        {/* Big 404 */}
        <p className="text-8xl font-bold text-primary opacity-30 select-none">404</p>
        <h1 className="text-2xl font-semibold text-foreground">Page not found</h1>
        <p className="text-muted-foreground text-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          {user ? (
            <Link to="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/">
                <Button variant="outline">Go Home</Button>
              </Link>
              <Link to="/login">
                <Button>Log In</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
