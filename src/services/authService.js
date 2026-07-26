import { readKey, writeKey } from "../lib/storage";

// Placeholder auth so routing/pages/protected routes can be built now.
// Swap these three functions for supabase.auth.* calls later — callers
// (AuthContext) don't need to change shape.

const SESSION_KEY = "habit-tracker:session";
const USERS_KEY = "habit-tracker:users";

export function getSession() {
  return readKey(SESSION_KEY, null);
}

export function register({ name, email, password }) {
  const users = readKey(USERS_KEY, []);
  if (users.some((u) => u.email === email)) {
    throw new Error("An account with this email already exists.");
  }
  const user = { id: crypto.randomUUID(), name, email, password };
  writeKey(USERS_KEY, [...users, user]);
  const session = { id: user.id, name: user.name, email: user.email };
  writeKey(SESSION_KEY, session);
  return session;
}

export function login({ email, password }) {
  const users = readKey(USERS_KEY, []);
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error("Invalid email or password.");
  const session = { id: user.id, name: user.name, email: user.email };
  writeKey(SESSION_KEY, session);
  return session;
}

import { supabase } from "../lib/supabase";

export async function loginWithGoogle() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://tycmykwfbzngdhrcfpsf.supabase.co";
  const directOAuthUrl = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(window.location.origin + "/dashboard")}`;

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (!error && data?.url) {
      window.location.href = data.url;
      return data;
    }
  } catch (err) {
    console.warn("Using direct OAuth URL fallback:", err);
  }

  // Guaranteed direct browser redirect
  window.location.href = directOAuthUrl;
}

export function requestPasswordReset(email) {
  // Stub: in a real backend this triggers a Supabase email.
  return { email, sent: true };
}
