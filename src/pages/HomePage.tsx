import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import Footer from "../components/Footer";

const HomePage = () => {
  const jwt = localStorage.getItem("token");
  if (jwt) return <Navigate to="/songs" />;

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Box flex="1" p={8}>
        <VStack spacing={4} align="stretch">
          <Heading>
            Welcome to the central Song bank where you will find lots of songs
            to suit your needs
          </Heading>
          <Text>Login to start exploring</Text>
        </VStack>
      </Box>
      <Footer />
    </Box>
  );
};

export default HomePage;
