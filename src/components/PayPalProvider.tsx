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
    components: "buttons",
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
