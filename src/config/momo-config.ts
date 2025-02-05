export const MOMO_CONFIG = {
  API_KEY: import.meta.env.VITE_MOMO_API_KEY,
  USER_ID: import.meta.env.VITE_MOMO_USER_ID,
  PRIMARY_KEY: import.meta.env.VITE_MOMO_PRIMARY_KEY,
  ENVIRONMENT: import.meta.env.VITE_MOMO_ENVIRONMENT || "sandbox",
  CALLBACK_URL: `${window.location.origin}/api/momo/callback`,
};
