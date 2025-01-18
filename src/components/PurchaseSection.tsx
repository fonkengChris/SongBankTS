import { Box, VStack, Heading, Text } from "@chakra-ui/react";
import PayPalPaymentButton from "./PayPalPaymentButton";

interface Props {
  itemName: string;
  price: number;
  onPurchaseComplete?: () => void;
}

const PurchaseSection = ({ itemName, price, onPurchaseComplete }: Props) => {
  return (
    <VStack spacing={4} align="stretch" p={4}>
      <Heading size="md">{itemName}</Heading>
      <Text>Price: ${price}</Text>
      <Box w="300px">
        <PayPalPaymentButton
          amount={price}
          description={itemName}
          onSuccess={onPurchaseComplete}
        />
      </Box>
    </VStack>
  );
};

export default PurchaseSection;
