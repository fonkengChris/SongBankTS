import { Button, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { axiosInstance } from "../services/api-client";

interface Props {
  amount: number;
  description: string;
  onSuccess?: () => void;
}

const MoMoPaymentButton = ({ amount, description, onSuccess }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      // Initialize payment with MTN MoMo API
      const response = await axiosInstance.post("/api/momo/payment", {
        amount,
        description,
        currency: "USD",
      });

      // Handle the payment response
      if (response.data.status === "SUCCESS") {
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully",
          status: "success",
        });
        if (onSuccess) onSuccess();
      } else {
        toast({
          title: "Payment Failed",
          description: "Please try again or use a different payment method",
          status: "error",
        });
      }
    } catch (error) {
      console.error("MoMo payment error:", error);
      toast({
        title: "Payment Error",
        description: "An error occurred while processing your payment",
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      colorScheme="yellow"
      isLoading={isLoading}
      loadingText="Processing Payment..."
      onClick={handlePayment}
      width="100%"
      size="lg"
    >
      Pay with MTN Mobile Money
    </Button>
  );
};

export default MoMoPaymentButton;
