const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

if (!PAYPAL_CLIENT_ID) {
  console.error("PayPal Client ID is not configured!");
}

export { PAYPAL_CLIENT_ID };
export const CURRENCY = "USD";
