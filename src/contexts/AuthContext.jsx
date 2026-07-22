import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // `user` shape: { id, email, name } — derived from Supabase session + profile
  const [user, setUser]       = useState(null);
  // `loading` is true while we're resolving the initial session on mount.
  // ProtectedRoute waits for this before deciding to redirect.
  const [loading, setLoading] = useState(true);

  // ----------------------------------------------------------------
  // Build a normalised user object from a Supabase session + profile
  // ----------------------------------------------------------------
  async function buildUser(supabaseUser) {
    if (!supabaseUser) return null;
    const profile = await authService.getProfile(supabaseUser.id);
    return {
      id:    supabaseUser.id,
      email: supabaseUser.email,
      name:  profile?.full_name ?? supabaseUser.user_metadata?.full_name ?? "",
      globalBackground: profile?.global_background ?? "stadium",
    };
  }

  // ----------------------------------------------------------------
  // Subscribe to auth state changes (handles refresh, tab refocus, etc.)
  // ----------------------------------------------------------------
  useEffect(() => {
    // 1. Resolve any existing session on first load
    supabase.auth.getSession().then(async ({ data }) => {
      setUser(await buildUser(data.session?.user ?? null));
      setLoading(false);
    });

    // 2. Listen for future sign-in / sign-out / token refresh events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(await buildUser(session?.user ?? null));
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ----------------------------------------------------------------
  // Auth actions
  // ----------------------------------------------------------------
  const login = async (credentials) => {
    const supabaseUser = await authService.login(credentials);
    // onAuthStateChange fires automatically and updates `user`
    return supabaseUser;
  };

  const register = async (details) => {
    const supabaseUser = await authService.register(details);
    return supabaseUser;
  };

  const logout = async () => {
    await authService.logout();
    // onAuthStateChange fires automatically and sets user → null
  };

  const updateGlobalBackground = async (bgId) => {
    if (!user) return;
    setUser((prev) => ({ ...prev, globalBackground: bgId }));
    await authService.updateProfile(user.id, { global_background: bgId });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateGlobalBackground }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
