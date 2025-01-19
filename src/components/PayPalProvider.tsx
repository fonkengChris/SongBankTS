import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { PAYPAL_CLIENT_ID } from "../config/paypal-config";
import { ChakraProvider } from "@chakra-ui/react";

interface Props {
  children: React.ReactNode;
}

const PayPalProvider = ({ children }: Props) => {
  const initialOptions = {
    "clientId": PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
    "data-sdk-integration-source": "button-factory",
  };

  return (
    <ChakraProvider>
      <PayPalScriptProvider deferLoading={false} options={initialOptions}>
        {children}
      </PayPalScriptProvider>
    </ChakraProvider>
  );
};

export default PayPalProvider;
