export const MOMO_CONFIG = {
  API_KEY: import.meta.env.VITE_MOMO_API_KEY,
  USER_ID: import.meta.env.VITE_MOMO_USER_ID,
  PRIMARY_KEY: import.meta.env.VITE_MOMO_PRIMARY_KEY,
  ENVIRONMENT: import.meta.env.VITE_MOMO_ENVIRONMENT || "sandbox",
  CALLBACK_URL: `${window.location.origin}/api/momo/callback`,
  CURRENCY: import.meta.env.VITE_MOMO_CURRENCY || "EUR", // EUR for sandbox, XAF for production
  BASE_URL: import.meta.env.VITE_MOMO_BASE_URL || "https://sandbox.momodeveloper.mtn.com",
};

// Helper function to get the appropriate currency based on environment
export const getMoMoCurrency = () => {
  return MOMO_CONFIG.ENVIRONMENT === "sandbox" ? "EUR" : "XAF";
};

// Helper function to get the appropriate base URL based on environment
export const getMoMoBaseUrl = () => {
  return MOMO_CONFIG.ENVIRONMENT === "sandbox" 
    ? "https://sandbox.momodeveloper.mtn.com"
    : "https://proxy.momoapi.mtn.cm";
};
