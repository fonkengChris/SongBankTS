import { Box, Heading, Text, VStack } from "@chakra-ui/react";

const PrivacyPage = () => {
  return (
    <Box p={8}>
      <VStack spacing={4} align="stretch">
        <Heading>Privacy Policy</Heading>
        <Text>Our privacy policy content goes here...</Text>
      </VStack>
    </Box>
  );
};

export default PrivacyPage;
