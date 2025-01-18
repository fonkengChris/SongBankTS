import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { PAYPAL_CLIENT_ID, CURRENCY } from "../config/paypal-config";

interface Props {
  children: React.ReactNode;
}

const PayPalProvider = ({ children }: Props) => {
  const initialOptions = {
    clientId: PAYPAL_CLIENT_ID,
    currency: CURRENCY,
    intent: "capture",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  );
};

export default PayPalProvider;
