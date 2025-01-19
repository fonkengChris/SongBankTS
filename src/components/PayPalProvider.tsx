import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { PAYPAL_CLIENT_ID, CURRENCY } from "../config/paypal-config";
import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

const PayPalProvider = ({ children }: Props) => {
  useEffect(() => {
    // Debug logging
    console.log("PayPal Provider Mounted");
    console.log("Client ID available:", !!PAYPAL_CLIENT_ID);
  }, []);

  const initialOptions = {
    clientId: PAYPAL_CLIENT_ID || "",
    currency: CURRENCY,
    intent: "capture",
    dataClientToken: "abc",
    enableFunding: "paypal",
    disableFunding: "paylater,venmo,card",
  };

  if (!PAYPAL_CLIENT_ID) {
    console.error("PayPal Client ID is missing!");
    return <div>PayPal configuration error. Please check your settings.</div>;
  }

  return (
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  );
};

export default PayPalProvider;
