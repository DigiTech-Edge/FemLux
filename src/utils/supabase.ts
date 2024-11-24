import { createClient } from "@supabase/supabase-js";
import env from "../env";

if (!env.supabase.url) {
  throw new Error("SUPABASE_URL is not defined");
}

if (!env.supabase.anonKey) {
  throw new Error("SUPABASE_ANON_KEY is not defined");
}

// Ensure URL starts with https://
const supabaseUrl = env.supabase.url.startsWith("http")
  ? env.supabase.url
  : `https://${env.supabase.url}`;

export const supabase = createClient(supabaseUrl, env.supabase.anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

// Admin client with additional privileges
export const supabaseAdmin = createClient(
  supabaseUrl,
  env.supabase.secretRole,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  }
);
