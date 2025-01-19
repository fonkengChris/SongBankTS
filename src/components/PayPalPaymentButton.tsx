import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Box, Spinner, Text } from "@chakra-ui/react";

interface Props {
  amount: number;
  description: string;
  onSuccess?: () => void;
}

const PayPalPaymentButton = ({ amount, description, onSuccess }: Props) => {
  const [{ isPending }] = usePayPalScriptReducer();

  if (isPending) {
    return (
      <Box textAlign="center" p={4}>
        <Spinner />
        <Text mt={2}>Loading Payment Options...</Text>
      </Box>
    );
  }

  return (
    <Box width="100%" minH="200px">
      <PayPalButtons
        createOrder={(_, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  value: amount.toString(),
                  currency_code: "USD",
                },
                description: description,
              },
            ],
          });
        }}
        onApprove={(_, actions) => {
          return actions.order!.capture().then((details) => {
            if (onSuccess) {
              onSuccess();
            }
          });
        }}
      />
    </Box>
  );
};

export default PayPalPaymentButton;
