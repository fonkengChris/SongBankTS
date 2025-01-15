import {
  Button,
  Heading,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Tr,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Box,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useCustomer from "../hooks/useCustomer";
import jwtDecode from "jwt-decode";
import { useState } from "react";
import APIClient from "../services/api-client";
import Customer from "../entities/Customer";
import CountrySelector from "../components/CountrySelector";
import "../index.css";
import { CUSTOMERS_ENDPOINT } from "../data/constants";
import { CustomerPayload } from "../types/forms";

const UserProfile = () => {
  // Define local interface for the post request
  interface CustomerUser {
    _id: string;
  }

  // Decode token and extract user ID
  const userToken = localStorage.getItem("token");

  // Define the shape of the decoded token
  interface DecodedToken {
    _id: string;
    name?: string;
    email?: string;
  }

  // Initialize user attributes
  let userId: string | null = null;
  let userName: string | null = null;
  let userEmail: string | null = null;

  if (userToken) {
    try {
      const decodedToken: DecodedToken = jwtDecode(userToken);
      userId = decodedToken._id;
      userName = decodedToken.name || null;
      userEmail = decodedToken.email || null;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }
  // Fetch the customer using the useCustomer hook
  const { data: customer, error, isLoading } = useCustomer(userId!);
  const [formData, setFormData] = useState({
    country: "",
    birth_date: "",
    phone_number: "",
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
        birth_date: formData.birth_date,
        phone_number: formData.phone_number,
      });
      window.location.reload();
    } catch (error) {
      console.error("Error creating customer profile:", error);
    }
  };

  return (
    <Box className="container">
      <Heading mb={4} textAlign="center">
        User Profile
      </Heading>

      {customer ? (
        <Box className="profile-container">
          <TableContainer>
            <Table variant="simple">
              <TableCaption>Profile details for {userName}</TableCaption>
              <Tbody>
                <Tr>
                  <Th>Full Name:</Th>
                  <Td>{userName}</Td>
                </Tr>
                <Tr>
                  <Th>Email Address:</Th>
                  <Td>{userEmail}</Td>
                </Tr>
                <Tr>
                  <Th>Nationality:</Th>
                  <Td>{customer?.country || "N/A"}</Td>
                </Tr>
                <Tr>
                  <Th>Date of Birth:</Th>
                  <Td>{customer?.birth_date || "N/A"}</Td>
                </Tr>
                <Tr>
                  <Th>Phone Number:</Th>
                  <Td>{customer?.phone_number || "N/A"}</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
          <Link to="/edit_profile">
            <Button mt={4} colorScheme="blue" width="100%">
              Edit Profile
            </Button>
          </Link>
        </Box>
      ) : (
        <section className="login-container">
          <p>No profile for this user</p>
          <form onSubmit={handleSubmit} className="login-form">
            <VStack spacing={4} align="stretch">
              <FormControl isRequired className="form-group">
                <FormLabel className="form-label">Country</FormLabel>
                <CountrySelector
                  selectedCountry={formData.country}
                  onSelect={(countryCode) =>
                    setFormData({ ...formData, country: countryCode })
                  }
                  onPhoneChange={(formattedNumber) =>
                    setFormData({ ...formData, phone_number: formattedNumber })
                  }
                  phone={formData.phone_number}
                />
              </FormControl>

              <FormControl isRequired className="form-group">
                <FormLabel className="form-label">Date of Birth</FormLabel>
                <Input
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) =>
                    setFormData({ ...formData, birth_date: e.target.value })
                  }
                  className="form-control"
                />
              </FormControl>

              <FormControl isRequired className="form-group">
                <FormLabel className="form-label">Phone Number</FormLabel>
                <Input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData({ ...formData, phone_number: e.target.value })
                  }
                  className="form-control"
                  placeholder="Enter phone number..."
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                width="100%"
                className="btn btn-primary"
              >
                Create Profile
              </Button>
            </VStack>
          </form>
        </section>
      )}
    </Box>
  );
};

export default UserProfile;
