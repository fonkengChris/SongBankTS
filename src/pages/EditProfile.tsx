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
import backgroundImage from "../assets/background_image.jpg";
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
      <Container maxW="container.md" py={8}>
        <VStack spacing={6}>
          <Heading>Authentication Required</Heading>
          <Text>Please log in to edit your profile.</Text>
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
    <Box minH="100vh" py={8}>
      <Container maxW="1200px">
        <Flex
          bgImage={`url(${backgroundImage})`}
          bgSize="cover"
          bgPosition="center"
          borderRadius="20px"
          p={8}
          direction="column"
          maxW="600px"
          mx="auto"
          boxShadow="xl"
        >
          <Heading size="lg" color="whiteAlpha.900" mb={8}>
            Edit Profile
          </Heading>

          {errMsg && (
            <Text color="red.300" mb={4}>
              {errMsg}
            </Text>
          )}

          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              <FormControl>
                <FormLabel color="whiteAlpha.900" fontWeight="bold">
                  Country
                </FormLabel>
                <Box
                  bg="whiteAlpha.100"
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="whiteAlpha.300"
                  _hover={{ borderColor: "cyan.300" }}
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
                  color="whiteAlpha.900"
                  _hover={{ bg: "whiteAlpha.100" }}
                  flex={1}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  bg="cyan.600"
                  color="whiteAlpha.900"
                  _hover={{ bg: "cyan.700" }}
                  flex={1}
                >
                  Update Profile
                </Button>
              </HStack>
            </VStack>
          </form>
        </Flex>
      </Container>
    </Box>
  );
};

export default EditProfile;
