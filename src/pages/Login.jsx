import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    try {
      login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = (e) => {
    e?.preventDefault();
    loginWithGoogle();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
      <Card className="w-full max-w-sm p-6">
        <h1 className="text-xl font-semibold mb-1">Welcome back</h1>
        <p className="text-muted-foreground text-sm mb-6">Log in to your account</p>
        
        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-neutral-800 border border-border text-foreground hover:bg-accent py-2.5 px-4 rounded-xl font-medium text-sm transition-all shadow-sm mb-4 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="relative flex items-center justify-center mb-4">
          <div className="border-t border-border w-full" />
          <span className="bg-card px-2 text-xs text-muted-foreground uppercase absolute">Or</span>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <Input type="email" placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input type="password" placeholder="Password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" className="w-full">Log in</Button>
        </form>
        <div className="flex justify-between text-sm text-muted-foreground mt-4">
          <Link to="/forgot-password" className="hover:text-foreground">Forgot password?</Link>
          <Link to="/register" className="hover:text-foreground">Create account</Link>
        </div>
      </Card>
    </div>
  );
}
