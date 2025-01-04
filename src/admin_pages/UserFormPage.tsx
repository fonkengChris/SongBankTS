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
} from "@chakra-ui/react";
import APIClient from "../services/api-client";
import User from "../entities/User";

const UserFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const apiClient = new APIClient<User>("/api/users");
  const inputBg = useColorModeValue("white", "gray.700");
  const inputColor = useColorModeValue("gray.800", "gray.100");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "regular" as "regular" | "admin" | "superAdmin",
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
    <Box maxW="container.md" mx="auto" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading color="blue.500">{id ? "Edit User" : "Create User"}</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel color="blue.500">Name</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                bg={inputBg}
                color={inputColor}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color="blue.500">Email</FormLabel>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                bg={inputBg}
                color={inputColor}
              />
            </FormControl>

            <FormControl>
              <FormLabel color="blue.500">Role</FormLabel>
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
              >
                <option value="regular">Regular User</option>
                <option value="admin">Admin</option>
                <option value="superAdmin">Super Admin</option>
              </Select>
            </FormControl>

            <Flex gap={4}>
              <Button
                onClick={() => navigate("/admin/users")}
                colorScheme="red"
                flex={1}
                minW="140px"
              >
                Cancel
              </Button>
              <Button type="submit" colorScheme="blue" flex={1} minW="140px">
                {id ? "Update User" : "Create User"}
              </Button>
            </Flex>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default UserFormPage;
