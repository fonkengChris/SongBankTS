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

interface Props {
  amount: number;
  description: string;
  onSuccess?: () => void;
}

const MoMoPaymentButton = ({ amount, description, onSuccess }: Props) => {
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

  const handlePinSubmit = () => {
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
      if (onSuccess) onSuccess();
      toast({
        title: "Payment Successful",
        description: "Transaction completed successfully",
        status: "success",
      });
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
