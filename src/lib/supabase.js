import { createClient } from "@supabase/supabase-js";

// These come from Vite's import.meta.env — sourced from .env at dev time
// and from environment variables at build/deploy time.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase env vars. Copy .env.example → .env and fill in your project URL and anon key."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
