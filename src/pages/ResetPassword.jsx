import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as authService from "../services/authService";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recovering, setRecovering] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function restoreRecoverySession() {
      try {
        const recovered = await authService.recoverPasswordSession();
        if (isMounted) {
          setRecovering(false);
          if (!recovered) {
            setError("This reset link is invalid or expired. Please request a new one.");
          }
        }
      } catch (err) {
        if (isMounted) {
          setRecovering(false);
          setError(err.message || "Unable to use this password reset link.");
        }
      }
    }

    restoreRecoverySession();

    return () => {
      isMounted = false;
    };
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await authService.updatePassword(password);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
      <Card className="w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-1">Set a new password</h1>
        <p className="text-muted-foreground text-sm mb-6">Choose a new password for your account.</p>

        {recovering ? (
          <p className="text-sm text-foreground">Validating your reset link…</p>
        ) : success ? (
          <div className="space-y-3">
            <p className="text-sm text-foreground">
              ✅ Your password has been updated successfully.
            </p>
            <Link to="/login">
              <Button variant="outline" className="w-full">Back to Login</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <Input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Updating…" : "Update password"}
            </Button>
          </form>
        )}

        <div className="text-sm text-muted-foreground mt-4 text-center">
          <Link to="/login" className="text-foreground font-medium">Back to login</Link>
        </div>
      </Card>
    </div>
  );
}
