const env = {
  appwrite: {
    endpoint: String(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || process.env.APPWRITE_ENDPOINT),
    projectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || process.env.APPWRITE_PROJECT_ID),
    apikey: String(process.env.APPWRITE_API_KEY)
  },
  resend: {
    apiKey: String(process.env.RESEND_API_KEY)
  }
} as const;

// Type assertions to ensure all environment variables are defined
const assertEnvVar = (value: string | undefined, name: string): string => {
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
};

// Validate required environment variables
(() => {
  assertEnvVar(env.appwrite.endpoint, 'APPWRITE_ENDPOINT');
  assertEnvVar(env.appwrite.projectId, 'APPWRITE_PROJECT_ID');
  assertEnvVar(env.appwrite.apikey, 'APPWRITE_API_KEY');
  assertEnvVar(env.resend.apiKey, 'RESEND_API_KEY');
})();

export default env;
