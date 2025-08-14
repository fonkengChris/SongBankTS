import { PayPalButtons } from "@paypal/react-paypal-js";
import { Box, useToast } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import paymentService from "../services/payment-service";

interface Props {
  amount: number;
  description: string;
  mediaFileId?: string;
  onSuccess?: () => void;
}

const PayPalPaymentButton = ({ amount, description, mediaFileId, onSuccess }: Props) => {
  const toast = useToast();
  const queryClient = useQueryClient();

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
                description,
                custom_id: mediaFileId || "", // Include mediaFileId for reference
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          try {
            if (actions.order) {
              const order = await actions.order.capture();
              console.log("PayPal capture result:", order);
              
              // Create payment record in database
              if (order.id) {
                try {
                  await paymentService.createPayment({
                    orderId: order.id,
                  amount: amount,
                  description: description,
                  status: "COMPLETED",
                  provider: "PAYPAL",
                  mediaFileId: mediaFileId || undefined,
                  purchaseType: "SONG",
                  transactionDetails: {
                    originalAmount: amount,
                    originalCurrency: "USD",
                    convertedAmount: amount,
                    convertedCurrency: "USD",
                    exchangeRate: 1,
                  },
                });

                  console.log("Payment record created successfully");
                  
                  // Invalidate purchases query to refresh the UI
                  queryClient.invalidateQueries({ queryKey: ["purchases"] });
                  
                  if (onSuccess) onSuccess();
                } catch (paymentError) {
                  console.error("Failed to create payment record:", paymentError);
                  
                  // Still call onSuccess since the PayPal payment was successful
                  // The user should get access even if our record creation failed
                  toast({
                    title: "Payment Successful",
                    description: "Payment completed but there was an issue with our records. Please contact support if you have issues accessing your purchase.",
                    status: "warning",
                    duration: 8000,
                    isClosable: true,
                  });
                  
                  if (onSuccess) onSuccess();
                }
              } else {
                console.error("PayPal order ID missing");
                toast({
                  title: "Payment Successful",
                  description: "Payment completed but there was an issue with our records. Please contact support if you have issues accessing your purchase.",
                  status: "warning",
                  duration: 8000,
                  isClosable: true,
                });
                
                if (onSuccess) onSuccess();
              }
            }
          } catch (error) {
            console.error("PayPal payment error:", error);
            toast({
              title: "Payment Error",
              description: "There was an issue processing your payment. Please try again.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        }}
        onError={(err) => {
          console.error("PayPal error:", err);
          toast({
            title: "Payment Error",
            description: "There was an issue with PayPal. Please try again.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }}
      />
    </Box>
  );
};

export default PayPalPaymentButton;
