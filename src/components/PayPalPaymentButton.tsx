import {
  PayPalButtons,
  usePayPalScriptReducer,
  DISPATCH_ACTION,
} from "@paypal/react-paypal-js";
import { useToast, Spinner, Box, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import APIClient from "../services/api-client";
import { useEffect } from "react";

interface Props {
  amount: number;
  description: string;
  onSuccess?: () => void;
}

const PayPalPaymentButton = ({ amount, description, onSuccess }: Props) => {
  const toast = useToast();
  const navigate = useNavigate();
  const [{ isPending, isRejected, isInitial }, dispatch] =
    usePayPalScriptReducer();
  const paymentApi = new APIClient("/api/payments");

  useEffect(() => {
    // Debug logging
    console.log("PayPal Button State:", { isPending, isRejected, isInitial });
  }, [isPending, isRejected, isInitial]);

  const handleRetry = () => {
    // Reload the PayPal script
    dispatch({
      type: DISPATCH_ACTION.RESET_OPTIONS,
      value: {
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: "USD",
      },
    });
  };

  if (isPending) {
    return (
      <Box textAlign="center" p={4}>
        <Spinner size="lg" />
        <Text mt={2}>Loading PayPal...</Text>
      </Box>
    );
  }

  if (isRejected) {
    return (
      <Box textAlign="center" p={4}>
        <Text color="red.500" mb={3}>
          Failed to load PayPal
        </Text>
        <Button onClick={handleRetry} colorScheme="blue" size="sm">
          Retry Loading PayPal
        </Button>
        <Text fontSize="sm" mt={2}>
          If the problem persists, please refresh the page
        </Text>
      </Box>
    );
  }

  return (
    <Box width="100%" minHeight="200px">
      <PayPalButtons
        style={{ layout: "vertical", label: "pay" }}
        forceReRender={[amount, description]}
        createOrder={(data, actions) => {
          console.log("Creating PayPal order...");
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
            console.log("Capturing PayPal order...");
            const order = await actions.order.capture();
            console.log("Payment successful:", order);

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
