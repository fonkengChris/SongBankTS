import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Heading,
  useToast,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import APIClient from "../services/api-client";
import Customer from "../entities/Customer";
import User from "../entities/User";
import { CustomerFormData } from "../types/forms";

const CustomerFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const apiClient = new APIClient<Customer, CustomerFormData>("/api/customers");
  const userApiClient = new APIClient<User>("/api/users");

  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    user: "", // This will store the user._id
    country: "",
  });

  const inputBg = useColorModeValue("white", "gray.700");
  const inputColor = useColorModeValue("gray.800", "gray.100");

  // Fetch users for the dropdown
  useEffect(() => {
    if (!id) {
      // Only fetch users when creating new customer
      userApiClient
        .getAll()
        .then((fetchedUsers) => setUsers(fetchedUsers))
        .catch((error) => {
          toast({
            title: "Error fetching users",
            description: error.message,
            status: "error",
            duration: 3000,
          });
        });
    }
  }, []);

  useEffect(() => {
    if (id) {
      apiClient
        .get(id)
        .then((customer) => {
          setFormData({
            user: customer.user._id || "",
            country: customer.country,
          });
        })
        .catch((error) => {
          toast({
            title: "Error fetching customer",
            description: error.message,
            status: "error",
            duration: 3000,
          });
        });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (id) {
        // For updates, we don't need to send the user field
        const { user, ...updateData } = formData;
        await apiClient.put(id, updateData);
        toast({
          title: "Customer updated",
          status: "success",
          duration: 3000,
        });
      } else {
        // For creation, we need the user field
        await apiClient.post(formData);
        toast({
          title: "Customer created",
          status: "success",
          duration: 3000,
        });
      }
      navigate("/admin/customers");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save customer",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Box maxW="container.md" mx="auto" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading color="blue.500">
          {id ? "Edit Customer" : "Create Customer"}
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            {!id && (
              <FormControl isRequired>
                <FormLabel color="blue.500">Select User</FormLabel>
                <Select
                  name="user"
                  value={formData.user}
                  onChange={handleChange}
                  placeholder="Select a user"
                  bg={inputBg}
                  color={inputColor}
                >
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </Select>
              </FormControl>
            )}

            <FormControl isRequired>
              <FormLabel color="blue.500">Country</FormLabel>
              <Input
                name="country"
                value={formData.country}
                onChange={handleChange}
                bg={inputBg}
                color={inputColor}
              />
            </FormControl>

            <Flex gap={4}>
              <Button
                onClick={() => navigate("/admin/customers")}
                colorScheme="red"
                flex={1}
                minW="140px"
              >
                Cancel
              </Button>
              <Button type="submit" colorScheme="blue" flex={1} minW="140px">
                {id ? "Update" : "Create"} Customer
              </Button>
            </Flex>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default CustomerFormPage;
