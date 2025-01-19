import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  VStack,
  useToast,
  Box,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import PayPalPaymentButton from "./PayPalPaymentButton";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  songTitle: string;
  price: number;
  mediaFileId: string;
}

const PurchaseModal = ({
  isOpen,
  onClose,
  songTitle,
  price,
  mediaFileId,
}: Props) => {
  const navigate = useNavigate();
  const toast = useToast();

  const handlePurchaseSuccess = () => {
    // Here you would typically:
    // 1. Update user's purchases in your backend
    // 2. Grant access to the content
    // 3. Navigate to the content

    toast({
      title: "Purchase Successful!",
      description: "You now have access to this content.",
      status: "success",
      duration: 5000,
    });

    onClose();
    navigate(`/media_files/${mediaFileId}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Purchase Premium Content</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} align="stretch" pb={6}>
            <Text>
              Get access to <strong>{songTitle}</strong>
            </Text>
            <Text fontWeight="bold">Price: ${price}</Text>
            <Box minHeight="150px" width="100%">
              <PayPalPaymentButton
                amount={price}
                description={`Purchase ${songTitle}`}
                onSuccess={handlePurchaseSuccess}
              />
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PurchaseModal;
