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
} from "@chakra-ui/react";
import { useState } from "react";
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
  const toast = useToast();

  const formatPhoneNumber = (number: string) => {
    // Remove all non-digits and any leading zeros
    let cleaned = number.replace(/\D/g, "").replace(/^0+/, "");

    // Remove 256 if it exists at the start
    if (cleaned.startsWith("256")) {
      cleaned = cleaned.substring(3);
    }

    // Add 256 prefix
    return `+237${cleaned}`;
  };

  const validatePhoneNumber = (number: string) => {
    const formatted = formatPhoneNumber(number);
    // MTN Uganda numbers should be 12 digits (256 + 9 digits)
    return formatted.length === 12;
  };

  const handlePayment = async () => {
    if (!phoneNumber.trim()) {
      setShowPinDialog(true);
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid MTN number (e.g., 0775123456)",
        status: "error",
        duration: 5000,
      });
      return;
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);
    setIsLoading(true);

    try {
      if (import.meta.env.DEV) {
        setShowPinDialog(true);
        setIsLoading(false);
        return;
      }

      const headers = {
        Authorization: `Bearer ${import.meta.env.VITE_MOMO_API_KEY}`,
        "X-Reference-Id": crypto.randomUUID(),
        "X-Target-Environment": import.meta.env.VITE_MOMO_ENVIRONMENT,
        "Ocp-Apim-Subscription-Key": import.meta.env.VITE_MOMO_PRIMARY_KEY,
      };

      const payload = {
        amount,
        description,
        currency: import.meta.env.VITE_MOMO_CURRENCY || "EUR",
        externalId: crypto.randomUUID(),
        payer: {
          partyIdType: "MSISDN",
          partyId: formattedPhone,
        },
        payerMessage: description,
        payeeNote: "Payment for digital content",
        mediaFileId: mediaFileId, // Include mediaFileId for backend payment record
      };

      console.log("Payment payload:", payload); // For debugging

      const response = await axiosInstance.post("/api/momo/payment", payload, {
        headers,
      });

      if (response.data.status === "PENDING") {
        toast({
          title: "Payment Initiated",
          description: "Please check your phone to complete the payment",
          status: "info",
          duration: 5000,
        });
        
        // Note: Payment record is automatically created by the backend
        // The backend MoMo endpoint already handles payment record creation
        console.log("MoMo payment initiated, record created by backend");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Error",
        description:
          error.response?.data?.details || "Failed to initiate payment",
        status: "error",
        duration: 5000,
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

    if (import.meta.env.DEV) {
      setShowPinDialog(false);
      
      // Simulate payment record creation in development
      try {
        const mockOrderId = `MOMO_DEV_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
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
            convertedAmount: amount * 3700, // Mock conversion to UGX
            convertedCurrency: "UGX",
            exchangeRate: 3700,
          },
        });

        console.log("Payment record created successfully (DEV mode)");
        
        if (onSuccess) onSuccess();
        toast({
          title: "Payment Successful",
          description: "Transaction completed successfully",
          status: "success",
        });
      } catch (paymentError) {
        console.error("Failed to create payment record (DEV mode):", paymentError);
        
        // Still show success since this is dev mode
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
      setShowPinDialog(false);
      handlePayment();
    }
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
                <FormHelperText>Format: +256XXXXXXXXX</FormHelperText>
              </FormControl>
              {import.meta.env.DEV && (
                <FormControl>
                  <FormLabel>PIN</FormLabel>
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
