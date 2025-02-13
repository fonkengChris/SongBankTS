import { Box, Heading, Text, VStack } from "@chakra-ui/react";

const CopyrightPage = () => {
  return (
    <Box p={8}>
      <VStack spacing={4} align="stretch">
        <Heading>Copyright Information</Heading>
        <Text>Our copyright information goes here...</Text>
      </VStack>
    </Box>
  );
};

export default CopyrightPage; 