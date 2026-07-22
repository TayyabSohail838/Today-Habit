import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ name: "", email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  // Supabase sends a confirmation email by default.
  // Show a message after sign-up instead of immediately navigating.
  const [needsConfirm, setNeedsConfirm] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabaseUser = await register(form);
      // If email confirmation is enabled, user.identities will be empty
      // and session will be null until they click the link.
      if (supabaseUser && !supabaseUser.confirmed_at) {
        setNeedsConfirm(true);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (needsConfirm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
        <Card className="w-full max-w-sm text-center space-y-3">
          <div className="text-4xl">✉️</div>
          <h1 className="text-xl font-semibold">Check your email</h1>
          <p className="text-muted-foreground text-sm">
            We sent a confirmation link to <strong>{form.email}</strong>.
            Click it to activate your account, then come back to log in.
          </p>
          <Link to="/login">
            <Button className="w-full mt-2">Go to Login</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
      <Card className="w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-1">Create your account</h1>
        <p className="text-muted-foreground text-sm mb-6">Start building better habits today</p>
        <form onSubmit={onSubmit} className="space-y-3">
          <Input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            type="password"
            placeholder="Password (min 6 characters)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            minLength={6}
            required
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account…" : "Sign up"}
          </Button>
        </form>
        <div className="text-sm text-muted-foreground mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-foreground font-medium">Log in</Link>
        </div>
      </Card>
    </div>
  );
}
