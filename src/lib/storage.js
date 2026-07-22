// Thin wrapper around localStorage so the rest of the app talks to a
// stable interface. Swap the internals for a Supabase client later
// without touching callers.

export function readKey(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeKey(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
