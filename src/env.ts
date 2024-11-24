const env = {
  resend: {
    apiKey: String(process.env.RESEND_API_KEY),
  },
  supabase: {
    url: String(process.env.SUPABASE_URL),
    anonKey: String(process.env.SUPABASE_ANON_KEY),
    secretRole: String(process.env.SUPABASE_SECRET_ROLE),
    jwtSecret: String(process.env.SUPABASE_JWT_SECRET),
  },
} as const;

// Type assertions to ensure all environment variables are defined
const assertEnvVar = (value: string | undefined, name: string): string => {
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
};

(() => {
  assertEnvVar(env.resend.apiKey, "RESEND_API_KEY");
  assertEnvVar(env.supabase.url, "SUPABASE_URL");
  assertEnvVar(env.supabase.anonKey, "SUPABASE_ANON_KEY");
  assertEnvVar(env.supabase.secretRole, "SUPABASE_SECRET_ROLE");
  assertEnvVar(env.supabase.jwtSecret, "SUPABASE_JWT_SECRET");
})();

export default env;
