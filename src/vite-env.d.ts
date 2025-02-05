/// <reference types="vite/client" />

interface ImportMetaEnv {
  // ... existing env variables ...
  readonly VITE_MOMO_API_KEY: string;
  readonly VITE_MOMO_USER_ID: string;
  readonly VITE_MOMO_PRIMARY_KEY: string;
  readonly VITE_MOMO_ENVIRONMENT: "sandbox" | "production";
}
