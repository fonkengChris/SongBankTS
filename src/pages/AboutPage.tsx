import { Box, Heading, Text, VStack } from "@chakra-ui/react";

const AboutPage = () => {
  return (
    <Box p={8}>
      <VStack spacing={4} align="stretch">
        <Heading>About SheetMusicLibrary</Heading>
        <Text>Information about our platform goes here...</Text>
      </VStack>
    </Box>
  );
};

export default AboutPage;
