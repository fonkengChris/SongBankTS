import React, { useState } from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Spinner,
  Badge,
  HStack,
  Icon,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaEdit, FaUser, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { MdPerson } from "react-icons/md";
import useCustomer from "../hooks/useCustomer";
import Customer from "../entities/Customer";
import APIClient from "../services/api-client";
import { CUSTOMERS_ENDPOINT } from "../data/constants";
import { CustomerPayload } from "../types/forms";
import CountrySelector from "../components/CountrySelector";
import FavouriteSongsList from "../components/FavouriteSongsList";
import useAuth from "../hooks/useAuth";

interface DecodedToken {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const UserProfile = () => {
  const { isAuthenticated, auth } = useAuth();
  const toast = useToast();

  if (!isAuthenticated) {
    return (
      <Container maxW="container.md" py={8}>
        <VStack spacing={6}>
          <Heading>Authentication Required</Heading>
          <Text>Please log in to view your profile.</Text>
          <Button as={Link} to="/auth" colorScheme="blue">
            Go to Login
          </Button>
        </VStack>
      </Container>
    );
  }

  // Initialize user attributes
  let userId: string | null = null;
  let userName: string | null = null;
  let userEmail: string | null = null;

  try {
    if (auth.access) {
      const decodedToken = JSON.parse(atob(auth.access.split('.')[1]));
      if (decodedToken) {
        userId = decodedToken._id;
        userName = decodedToken.name || null;
        userEmail = decodedToken.email || null;
      }
    }
  } catch (error) {
    console.error("Error decoding token:", error);
  }

  // Fetch the customer using the useCustomer hook
  const { data: customer, error, isLoading } = useCustomer(userId!);
  const [formData, setFormData] = useState({
    country: "",
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching customer data: {error.message}</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiClient = new APIClient<Customer, CustomerPayload>(
      CUSTOMERS_ENDPOINT
    );
    try {
      await apiClient.post({
        user: userId!,
        country: formData.country,
      });
      window.location.reload();
    } catch (error) {
      console.error("Error creating customer profile:", error);
    }
  };

  const handleCountryChange = (countryCode: string) => {
    setFormData((prev) => ({
      ...prev,
      country: countryCode,
    }));
  };

  return (
    <Box minH="100vh" bgSize="cover" bgPosition="center" py={8}>
      <Container maxW="1200px">
        <VStack spacing={8}>
          {/* Profile Information Section */}
          <Flex
            bg="rgba(26, 32, 44, 0.95)"
            borderRadius="20px"
            p={8}
            gap={8}
            direction={{ base: "column", md: "row" }}
            boxShadow="xl"
            w="full"
          >
            {/* Left Section - 40% */}
            <VStack
              flex={{ base: "1", md: "0.4" }}
              spacing={6}
              align="center"
              justify="space-between"
              h="full"
              bg="cyan.600"
              borderRadius="lg"
              p={8}
            >
              <VStack spacing={6} align="center" w="full">
                <Box
                  width="180px"
                  height="180px"
                  borderRadius="full"
                  overflow="hidden"
                  borderWidth="3px"
                  borderColor="cyan.200"
                  bg="white"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={MdPerson} boxSize="100px" color="cyan.500" />
                </Box>
                <Heading size="lg" color="gray.700" textAlign="center">
                  {userName}
                </Heading>
              </VStack>

              <Button
                as={Link}
                to="/settings"
                leftIcon={<Icon as={FaEdit} />}
                colorScheme="blue"
                variant="solid"
                size="lg"
                width="80%"
                _hover={{ bg: "cyan.600" }}
              >
                Settings
              </Button>
            </VStack>

            {/* Right Section - 60% */}
            <Box flex={{ base: "1", md: "0.6" }} pl={{ base: 0, md: 8 }}>
              <Heading size="lg" color="whiteAlpha.900" mb={8}>
                Information
              </Heading>

              <VStack spacing={6} align="stretch">
                <Box flex="1">
                  <HStack spacing={3} mb={2}>
                    <Icon as={FaEnvelope} color="cyan.600" boxSize={5} />
                    <Text color="whiteAlpha.700" fontSize="sm">
                      Email Address
                    </Text>
                  </HStack>
                  <Text color="whiteAlpha.900" fontSize="md" fontWeight="medium">
                    {userEmail}
                  </Text>
                </Box>

                <Box>
                  <HStack spacing={3} mb={2}>
                    <Icon as={FaMapMarkerAlt} color="cyan.600" boxSize={5} />
                    <Text color="whiteAlpha.700" fontSize="sm">
                      Country
                    </Text>
                  </HStack>
                  <Text color="whiteAlpha.900" fontSize="md" fontWeight="medium">
                    {customer?.country || "N/A"}
                  </Text>
                </Box>
              </VStack>

              {!customer && (
                <Box mt={8}>
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={6} align="stretch">
                      <CountrySelector
                        selectedCountry={formData.country}
                        onSelect={handleCountryChange}
                      />
                      <Button
                        type="submit"
                        bg="cyan.600"
                        color="white"
                        size="lg"
                        width="100%"
                        _hover={{ bg: "cyan.600" }}
                      >
                        Create Profile
                      </Button>
                    </VStack>
                  </form>
                </Box>
              )}
            </Box>
          </Flex>

          {/* Favourite Songs Section */}
          <Box
            bg="rgba(26, 32, 44, 0.95)"
            borderRadius="20px"
            p={8}
            boxShadow="xl"
            w="full"
          >
            <FavouriteSongsList />
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default UserProfile;
