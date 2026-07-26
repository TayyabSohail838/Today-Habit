import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get the current session on mount (handles the OAuth hash redirect)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email,
        });
      } else {
        // Fallback: check local storage-based session (email/password users)
        setUser(authService.getSession());
      }
      setLoading(false);
    });

    // 2. Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email,
        });
      } else {
        // No Supabase session — check local session
        setUser(authService.getSession());
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const login = (credentials) => {
    const session = authService.login(credentials);
    setUser(session);
    return session;
  };

  const register = (details) => {
    const session = authService.register(details);
    setUser(session);
    return session;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    authService.logout();
    setUser(null);
  };

  const loginWithGoogle = () => authService.loginWithGoogle();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
