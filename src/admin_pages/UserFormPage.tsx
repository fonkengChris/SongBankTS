import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Checkbox,
  useToast,
  useColorModeValue,
  Flex,
  Select,
  Card,
  CardBody,
} from "@chakra-ui/react";
import APIClient from "../services/api-client";
import User from "../entities/User";
import { UserFormData } from "../types/forms";

const UserFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const apiClient = new APIClient<User, UserFormData>("/api/users");
  
  // Color mode values for consistent styling
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const inputBg = useColorModeValue("white", "gray.700");
  const inputColor = useColorModeValue("gray.800", "gray.100");
  const inputBorderColor = useColorModeValue("gray.300", "gray.600");
  const inputFocusBorderColor = useColorModeValue("blue.500", "blue.300");

  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    role: "regular",
  });

  useEffect(() => {
    if (id) {
      // Fetch user data if editing
      apiClient
        .get(id)
        .then((user) => {
          setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
          });
        })
        .catch((error) => {
          toast({
            title: "Error fetching user",
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
        // Update existing user
        await apiClient.put(id, formData);
      } else {
        // Create new user
        await apiClient.post(formData);
      }

      toast({
        title: `User ${id ? "updated" : "created"} successfully`,
        status: "success",
        duration: 3000,
      });
      navigate("/admin/users");
    } catch (error) {
      toast({
        title: `Error ${id ? "updating" : "creating"} user`,
        description:
          error instanceof Error ? error.message : "An error occurred",
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Box maxW="container.md" mx="auto" py={8} px={6}>
      <VStack spacing={8} align="stretch">
        <Heading color="blue.500" fontWeight="bold" textAlign="center">
          {id ? "Edit User" : "Create User"}
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
                <FormControl isRequired>
                  <FormLabel color="blue.500" fontWeight="semibold" mb={2}>Name</FormLabel>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
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
                    placeholder="Enter user name"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="blue.500" fontWeight="semibold" mb={2}>Email</FormLabel>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
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
                    placeholder="Enter user email"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color="blue.500" fontWeight="semibold" mb={2}>Role</FormLabel>
                  <Select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as "regular" | "admin" | "superAdmin",
                      })
                    }
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
                    <option value="regular">Regular User</option>
                    <option value="admin">Admin</option>
                    <option value="superAdmin">Super Admin</option>
                  </Select>
                </FormControl>

                <Flex gap={4} pt={4}>
                  <Button
                    onClick={() => navigate("/admin/users")}
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
                    {id ? "Update User" : "Create User"}
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

export default UserFormPage;
