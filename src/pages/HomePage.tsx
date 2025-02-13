import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Box flex="1" p={8}>
        <VStack spacing={4} align="stretch">
          <Heading>
            Welcome to the central Song bank where you will find lots of songs
            to suit your needs
          </Heading>
        </VStack>
      </Box>
    </Box>
  );
};

export default HomePage;
