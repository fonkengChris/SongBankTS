import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ChakraProvider } from "@chakra-ui/react";

interface Props {
  children: React.ReactNode;
}

const PayPalProvider = ({ children }: Props) => {
  const initialOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
    "enable-funding": "paypal",
    "disable-funding": "card",
    components: "buttons",
    "data-namespace": "paypal_sdk",
    "data-paypal-sdk-version": "5.0.235",
    "data-page-type": "checkout",
  };

  return (
    <ChakraProvider>
      <PayPalScriptProvider options={initialOptions}>
        {children}
      </PayPalScriptProvider>
    </ChakraProvider>
  );
};

export default PayPalProvider;
