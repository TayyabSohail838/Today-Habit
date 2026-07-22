import { useState } from "react";
import { Link } from "react-router-dom";
import * as authService from "../services/authService";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export function ForgotPassword() {
  const [email, setEmail]     = useState("");
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
      <Card className="w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-1">Reset password</h1>
        <p className="text-muted-foreground text-sm mb-6">We'll send you a reset link</p>
        {sent ? (
          <div className="space-y-3">
            <p className="text-sm text-foreground">
              ✅ Reset link sent to <strong>{email}</strong>. Check your inbox (and spam folder).
            </p>
            <Link to="/login">
              <Button variant="outline" className="w-full">Back to Login</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending…" : "Send reset link"}
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
