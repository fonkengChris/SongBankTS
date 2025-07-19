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
  Card,
  CardBody,
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

  // Color mode values for consistent styling
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const inputBg = useColorModeValue("white", "gray.700");
  const inputColor = useColorModeValue("gray.800", "gray.100");
  const inputBorderColor = useColorModeValue("gray.300", "gray.600");
  const inputFocusBorderColor = useColorModeValue("blue.500", "blue.300");

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
    <Box maxW="container.md" mx="auto" py={8} px={6}>
      <VStack spacing={8} align="stretch">
        <Heading color="blue.500" fontWeight="bold" textAlign="center">
          {id ? "Edit Customer" : "Create Customer"}
        </Heading>
        
        <Card 
          bg={bgColor} 
          shadow="md" 
          border="1px solid" 
          borderColor={borderColor}
          borderRadius="lg"
        >
          <CardBody p={8}>
            <form onSubmit={handleSubmit}>
              <VStack spacing={6} align="stretch">
                {!id && (
                  <FormControl isRequired>
                    <FormLabel color="blue.500" fontWeight="semibold" mb={2}>
                      Select User
                    </FormLabel>
                    <Select
                      name="user"
                      value={formData.user}
                      onChange={handleChange}
                      placeholder="Select a user"
                      bg={inputBg}
                      color={inputColor}
                      borderColor={inputBorderColor}
                      _hover={{ borderColor: inputFocusBorderColor }}
                      _focus={{ 
                        borderColor: inputFocusBorderColor, 
                        boxShadow: `0 0 0 1px ${inputFocusBorderColor}` 
                      }}
                      transition="all 0.2s"
                      size="lg"
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
                  <FormLabel color="blue.500" fontWeight="semibold" mb={2}>
                    Country
                  </FormLabel>
                  <Input
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    bg={inputBg}
                    color={inputColor}
                    borderColor={inputBorderColor}
                    _hover={{ borderColor: inputFocusBorderColor }}
                    _focus={{ 
                      borderColor: inputFocusBorderColor, 
                      boxShadow: `0 0 0 1px ${inputFocusBorderColor}` 
                    }}
                    transition="all 0.2s"
                    size="lg"
                    placeholder="Enter country name"
                  />
                </FormControl>

                <Flex gap={4} pt={4}>
                  <Button
                    onClick={() => navigate("/admin/customers")}
                    colorScheme="red"
                    flex={1}
                    minW="140px"
                    size="lg"
                    _hover={{ transform: "translateY(-1px)", boxShadow: "lg" }}
                    transition="all 0.2s"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    colorScheme="blue" 
                    flex={1} 
                    minW="140px"
                    size="lg"
                    _hover={{ transform: "translateY(-1px)", boxShadow: "lg" }}
                    transition="all 0.2s"
                  >
                    {id ? "Update" : "Create"} Customer
                  </Button>
                </Flex>
              </VStack>
            </form>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default CustomerFormPage;
