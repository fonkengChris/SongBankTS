import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Flex,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Button,
  HStack,
  Text,
  Stack,
  Image,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import jwtDecode from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import { CUSTOMERS_ENDPOINT } from "../data/constants";
import useCustomer from "../hooks/useCustomer";
import APIClient from "../services/api-client";
import Customer from "../entities/Customer";
import CountrySelector from "../components/CountrySelector";
import { CustomerUpdateFormData } from "../types/forms";
import useAuth from "../hooks/useAuth";

const customerApiClient = new APIClient<Customer, CustomerUpdateFormData>(
  CUSTOMERS_ENDPOINT
);

const EditProfile = () => {
  const { isAuthenticated, auth } = useAuth();
  const navigate = useNavigate();
  const [country, setCountry] = useState("");
  const [errMsg, setErrMsg] = useState("");

  if (!isAuthenticated) {
    return (
      <Box minH="100vh" bg="gray.50" py={8}>
        <Container maxW="md">
          <Stack spacing={8} align="center">
            <Stack spacing={4} align="center" p={8} bg="white" borderRadius="xl" boxShadow="xl" w="full">
              <Image
                src="/songBankLogo.png"
                alt="SongLibrary Logo"
                boxSize="80px"
                objectFit="contain"
              />
              <Heading color="gray.700">Authentication Required</Heading>
            </Stack>
            <Box bg="white" p={8} borderRadius="xl" boxShadow="xl" w="full" textAlign="center">
              <Text mb={6}>Please log in to edit your profile.</Text>
              <Button as={Link} to="/auth" colorScheme="blue" size="lg" w="full">
                Go to Login
              </Button>
            </Box>
          </Stack>
        </Container>
      </Box>
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

  // Fetch the customer
  const { data: customer, error, isLoading } = useCustomer(userId!);

  useEffect(() => {
    if (customer) {
      setCountry(customer.country || "");
    }
    if (error) {
      setErrMsg("Error fetching customer details.");
    }
  }, [customer, error]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!customer?._id) return;

      await customerApiClient.put(customer._id, {
        country: country || customer.country,
      });

      navigate(`/users/${customer._id}`);
    } catch (error) {
      const err = error as AxiosError;
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg("Error updating profile.");
      }
    }
  };

  if (isLoading) return <Text color="whiteAlpha.900">Loading...</Text>;
  if (!customer)
    return <Text color="whiteAlpha.900">No customer profile found.</Text>;

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="md">
        <Stack spacing={8} align="center">
          <Stack spacing={4} align="center" p={8} bg="white" borderRadius="xl" boxShadow="xl" w="full">
            <Image
              src="/songBankLogo.png"
              alt="SongLibrary Logo"
              boxSize="80px"
              objectFit="contain"
            />
            <Heading size="lg" color="gray.700">
              Edit Profile
            </Heading>
          </Stack>

          <Box bg="white" p={8} borderRadius="xl" boxShadow="xl" w="full">
            {errMsg && (
              <Text color="red.500" mb={4} textAlign="center">
                {errMsg}
              </Text>
            )}

            <form onSubmit={handleSubmit}>
              <VStack spacing={6}>
                <FormControl>
                  <FormLabel fontWeight="bold" color="gray.700">
                    Country
                  </FormLabel>
                  <Box
                    bg="gray.50"
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor="gray.300"
                    _hover={{ borderColor: "blue.300" }}
                  >
                    <CountrySelector
                      selectedCountry={country}
                      onSelect={(countryCode) => setCountry(countryCode)}
                    />
                  </Box>
                </FormControl>

                <HStack spacing={4} width="100%" pt={4}>
                  <Button
                    onClick={() => navigate(`/users/${customer._id}`)}
                    variant="outline"
                    color="gray.700"
                    _hover={{ bg: "gray.100" }}
                    flex={1}
                    size="lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    bg="blue.600"
                    color="white"
                    _hover={{ bg: "blue.700" }}
                    flex={1}
                    size="lg"
                  >
                    Update Profile
                  </Button>
                </HStack>
              </VStack>
            </form>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default EditProfile;
