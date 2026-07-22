// Authentication service — all calls delegate to Supabase Auth.
// Callers (AuthContext) use the same function names as before so
// context/page code stays stable.

import { supabase } from "../lib/supabase";

// ----------------------------------------------------------------
// Session
// ----------------------------------------------------------------

/** Returns the current session object (or null if not logged in). */
export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session ?? null;
}

// ----------------------------------------------------------------
// Auth actions
// ----------------------------------------------------------------

/**
 * Create a new account.
 * Supabase sends a confirmation email by default — the user must
 * click the link before they can sign in.  You can disable this
 * in Dashboard → Authentication → Providers → Email.
 */
export async function register({ name, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name }, // stored in auth.users raw_user_meta_data
    },
  });
  if (error) throw new Error(error.message);
  return data.user;
}

/**
 * Sign in with email + password.
 * Returns the Supabase User object on success.
 */
export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(error.message);
  return data.user;
}

/**
 * Sign out the current user and clear the local session.
 */
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

/**
 * Send a password-reset email.
 * The link in the email redirects to /reset-password (Supabase handles it).
 */
export async function requestPasswordReset(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw new Error(error.message);
  return { email, sent: true };
}

// ----------------------------------------------------------------
// Profile helpers
// ----------------------------------------------------------------

/**
 * Fetch the profile row for a given user id.
 * Returns { full_name, global_background } or null.
 */
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("full_name, global_background")
    .eq("id", userId)
    .single();
  if (error) return null;
  return data;
}

/**
 * Patch the profile row for the current user.
 */
export async function updateProfile(userId, patch) {
  const { error } = await supabase
    .from("profiles")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", userId);
  if (error) throw new Error(error.message);
}
