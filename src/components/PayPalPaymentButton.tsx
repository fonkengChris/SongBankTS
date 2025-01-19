import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useToast, Spinner, Box, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import APIClient from "../services/api-client";

interface Props {
  amount: number;
  description: string;
  onSuccess?: () => void;
}

const PayPalPaymentButton = ({ amount, description, onSuccess }: Props) => {
  const toast = useToast();
  const navigate = useNavigate();
  const [{ isPending, isRejected }] = usePayPalScriptReducer();
  const paymentApi = new APIClient("/api/payments");

  if (isPending) {
    return (
      <Box textAlign="center" p={4}>
        <Spinner />
        <Text mt={2}>Loading PayPal...</Text>
      </Box>
    );
  }

  if (isRejected) {
    return (
      <Box textAlign="center" p={4}>
        <Text color="red.500">Failed to load PayPal</Text>
        <Text fontSize="sm">Please refresh the page and try again</Text>
      </Box>
    );
  }

  return (
    <Box width="100%">
      <PayPalButtons
        style={{ layout: "vertical", label: "pay" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: description,
                amount: {
                  currency_code: "USD",
                  value: amount.toString(),
                },
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          if (!actions.order) return;

          try {
            const order = await actions.order.capture();
            console.log("Payment successful:", order);

            // Send payment details to your backend
            await paymentApi.post({
              orderId: order.id,
              status: order.status,
              amount: amount,
              description: description,
            });

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
              description: "There was an error processing your payment.",
              status: "error",
              duration: 5000,
            });
          }
        }}
        onError={(err) => {
          console.error("PayPal Error:", err);
          toast({
            title: "Payment Error",
            description: "There was an error with PayPal. Please try again.",
            status: "error",
            duration: 5000,
          });
        }}
      />
    </Box>
  );
};

export default PayPalPaymentButton;
