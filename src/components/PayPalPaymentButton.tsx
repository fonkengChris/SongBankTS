import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Box, Spinner, Text, useToast } from "@chakra-ui/react";
import APIClient from "../services/api-client";

interface Props {
  amount: number;
  description: string;
  onSuccess?: () => void;
}

const PayPalPaymentButton = ({ amount, description, onSuccess }: Props) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const toast = useToast();
  const apiClient = new APIClient("/api/payments");

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
        style={{ layout: "vertical" }}
        createOrder={(_, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  value: amount.toString(),
                  currency_code: "USD",
                },
                description,
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          if (!actions.order) return;
          try {
            const order = await actions.order.capture();
            toast({
              title: "Payment Successful",
              description: "Thank you for your purchase!",
              status: "success",
              duration: 5000,
            });
            if (onSuccess) onSuccess();
          } catch (error) {
            console.error("Payment failed:", error);
            toast({
              title: "Payment Failed",
              description: "Sorry, your payment could not be processed",
              status: "error",
              duration: 5000,
            });
          }
        }}
      />
    </Box>
  );
};

export default PayPalPaymentButton;
