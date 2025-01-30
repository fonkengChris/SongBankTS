import { PayPalButtons } from "@paypal/react-paypal-js";
import { Box } from "@chakra-ui/react";

interface Props {
  amount: number;
  description: string;
  onSuccess?: () => void;
}

const PayPalPaymentButton = ({ amount, description, onSuccess }: Props) => {
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
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          if (actions.order) {
            const order = await actions.order.capture();
            console.log("Capture result", order);
            if (onSuccess) onSuccess();
          }
        }}
      />
    </Box>
  );
};

export default PayPalPaymentButton;
