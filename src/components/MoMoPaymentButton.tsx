import {
  Button,
  Text,
  VStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  HStack,
  FormControl,
  FormLabel,
  FormHelperText,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../services/api-client";
import paymentService from "../services/payment-service";

interface Props {
  amount: number;
  description: string;
  mediaFileId?: string;
  onSuccess?: () => void;
}

const MoMoPaymentButton = ({ amount, description, mediaFileId, onSuccess }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [pin, setPin] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null);
  const toast = useToast();
  const queryClient = useQueryClient();

  // Format phone number for Cameroon (MTN)
  const formatPhoneNumber = (number: string) => {
    // Remove all non-digits and any leading zeros
    let cleaned = number.replace(/\D/g, "").replace(/^0+/, "");
    
    // Remove country code if present (237 for Cameroon)
    if (cleaned.startsWith("237")) {
      cleaned = cleaned.substring(3);
    }
    
    // Ensure it's a valid Cameroon mobile number (9 digits starting with 6, 7, 8, or 9)
    if (cleaned.length === 9 && /^[6789]/.test(cleaned)) {
      return cleaned; // Return without country code as MTN API expects
    }
    
    throw new Error("Invalid Cameroon mobile number format. Please enter a valid number (e.g., 677123456)");
  };

  const validatePhoneNumber = (number: string) => {
    try {
      formatPhoneNumber(number);
      return true;
    } catch {
      return false;
    }
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [statusCheckInterval]);

  // Function to check payment status
  const checkPaymentStatus = async (refId: string) => {
    try {
      const response = await axiosInstance.get(`/api/momo/status/${refId}`);
      const status = response.data.status;
      
      setPaymentStatus(status);
      
      if (status === "SUCCESSFUL") {
        // Payment completed successfully
        if (statusCheckInterval) {
          clearInterval(statusCheckInterval);
          setStatusCheckInterval(null);
        }
        
        // Invalidate purchases query to refresh the UI
        queryClient.invalidateQueries({ queryKey: ["purchases"] });
        
        toast({
          title: "Payment Successful!",
          description: "Your payment has been completed successfully.",
          status: "success",
          duration: 5000,
        });
        
        if (onSuccess) onSuccess();
      } else if (status === "FAILED" || status === "TIMEOUT") {
        // Payment failed
        if (statusCheckInterval) {
          clearInterval(statusCheckInterval);
          setStatusCheckInterval(null);
        }
        
        toast({
          title: "Payment Failed",
          description: "Your payment was not completed. Please try again.",
          status: "error",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
    }
  };

  // Start polling for payment status
  const startStatusPolling = (refId: string) => {
    // Check immediately
    checkPaymentStatus(refId);
    
    // Then check every 10 seconds
    const interval = setInterval(() => {
      checkPaymentStatus(refId);
    }, 10000);
    
    setStatusCheckInterval(interval);
  };

  const handlePayment = async () => {
    if (!phoneNumber.trim()) {
      setShowPinDialog(true);
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Cameroon MTN number (e.g., 677123456)",
        status: "error",
        duration: 5000,
      });
      return;
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);
    setIsLoading(true);

    try {
      if (import.meta.env.DEV) {
        // Development mode - simulate payment
        const mockOrderId = `MOMO_DEV_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        try {
          await paymentService.createPayment({
            orderId: mockOrderId,
            amount: amount,
            description: description,
            status: "COMPLETED",
            provider: "MTN_MOMO",
            mediaFileId: mediaFileId,
            purchaseType: "SONG",
            transactionDetails: {
              originalAmount: amount,
              originalCurrency: "USD",
              convertedAmount: amount * 600, // Mock conversion to XAF
              convertedCurrency: "XAF",
              exchangeRate: 600,
            },
          });

          console.log("Payment record created successfully (DEV mode)");
          
          // Invalidate purchases query to refresh the UI
          queryClient.invalidateQueries({ queryKey: ["purchases"] });
          
          if (onSuccess) onSuccess();
          toast({
            title: "Payment Successful",
            description: "Transaction completed successfully (Development Mode)",
            status: "success",
          });
        } catch (paymentError) {
          console.error("Failed to create payment record (DEV mode):", paymentError);
          
          toast({
            title: "Payment Successful",
            description: "Payment completed but there was an issue with our records. Please contact support if you have issues accessing your purchase.",
            status: "warning",
            duration: 8000,
            isClosable: true,
          });
          
          if (onSuccess) onSuccess();
        }
        
        setIsLoading(false);
        setShowPinDialog(false);
        return;
      }

      // Production mode - make actual API call
      const payload = {
        amount,
        description,
        phoneNumber: formattedPhone,
        mediaFileId: mediaFileId,
      };

      console.log("Payment payload:", payload);

      const response = await axiosInstance.post("/api/momo/payment", payload);

      if (response.data.status === "PENDING") {
        const refId = response.data.referenceId;
        setReferenceId(refId);
        setPaymentStatus("PENDING");
        
        toast({
          title: "Payment Initiated",
          description: "Please check your phone to complete the payment. We'll notify you when it's completed.",
          status: "info",
          duration: 8000,
          isClosable: true,
        });
        
        // Start polling for status updates
        startStatusPolling(refId);
        
        setShowPinDialog(false);
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      
      let errorMessage = "Failed to initiate payment";
      if (error.response?.data?.details) {
        errorMessage = error.response.data.details;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      toast({
        title: "Payment Error",
        description: errorMessage,
        status: "error",
        duration: 8000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinSubmit = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number",
        status: "error",
      });
      return;
    }

    handlePayment();
  };

  return (
    <VStack spacing={4} width="100%">
      <Button
        colorScheme="yellow"
        isLoading={isLoading}
        loadingText="Initiating Payment..."
        onClick={handlePayment}
        width="100%"
        size="lg"
      >
        Pay with MTN Mobile Money
      </Button>

      {/* Payment Status Alert */}
      {paymentStatus && (
        <Alert 
          status={paymentStatus === "SUCCESSFUL" ? "success" : paymentStatus === "FAILED" ? "error" : "info"}
          borderRadius="md"
        >
          <AlertIcon />
          <AlertDescription>
            {paymentStatus === "PENDING" && "Payment initiated. Please complete on your phone."}
            {paymentStatus === "SUCCESSFUL" && "Payment completed successfully!"}
            {paymentStatus === "FAILED" && "Payment failed. Please try again."}
            {paymentStatus === "TIMEOUT" && "Payment timed out. Please try again."}
          </AlertDescription>
        </Alert>
      )}

      <Modal
        isOpen={showPinDialog}
        onClose={() => setShowPinDialog(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mobile Money Payment</ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                />
                <FormHelperText>Format: 677123456 (Cameroon MTN number)</FormHelperText>
              </FormControl>
              {import.meta.env.DEV && (
                <FormControl>
                  <FormLabel>PIN (Dev Mode)</FormLabel>
                  <Input
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter 4-digit PIN"
                  />
                </FormControl>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={4}>
              <Button colorScheme="blue" onClick={handlePinSubmit}>
                Submit
              </Button>
              <Button onClick={() => setShowPinDialog(false)}>Cancel</Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default MoMoPaymentButton;
