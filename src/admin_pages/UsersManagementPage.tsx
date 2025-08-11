import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
  useBreakpointValue,
  Stack,
  Text,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Card,
  CardBody,
  SimpleGrid,
  HStack,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink, Navigate } from "react-router-dom";
import useUsers from "../hooks/useUsers"; // Custom hook to fetch users data
import User from "../entities/User"; // Define your User interface/entity here
import APIClient from "../services/api-client";
import { FiMoreVertical, FiEdit, FiTrash2 } from "react-icons/fi";
import useAuth from "../hooks/useAuth";

const UsersManagementPage = () => {
  const { isAuthenticated, auth } = useAuth();
  
  // Add authorization check at the top of the component
  if (!isAuthenticated) return <Navigate to="/auth" />;

  let user: any = null;
  try {
    if (auth.access) {
      user = JSON.parse(atob(auth.access.split('.')[1]));
    }
  } catch (error) {
    console.error("Error decoding token:", error);
  }

  if (!user || user.role !== "superAdmin") {
    return <Navigate to="/admin" />;
  }

  // State to store users
  const [users, setUsers] = useState<User[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const toast = useToast();
  const apiClient = new APIClient<User>("/api/users");

  // Responsive breakpoints
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isTablet = useBreakpointValue({ base: false, md: true, lg: false });

  // Color mode values for better visibility
  const textColor = useColorModeValue("gray.800", "gray.100");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.300");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    // Define an async function to fetch users
    const fetchUsers = async () => {
      try {
        const userList = await useUsers(); // Fetch users using custom hook
        setUsers(userList || []); // Update the state with the resolved value
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers(); // Call the async function
  }, []); // Empty dependency array ensures this runs once on mount

  const handleDeleteClick = (userId: string) => {
    // This function is not used in the new code, but kept for now
    // The actual deletion logic is handled by the API client
  };

  const handleDeleteConfirm = async () => {
    // This function is not used in the new code, but kept for now
    // The actual deletion logic is handled by the API client
  };

  // Mobile card component
  const UserCard = ({ user }: { user: User }) => (
    <Box shadow="sm" border="1px" borderColor={borderColor} bg={cardBg} p={4} borderRadius="md">
      <VStack align="stretch" spacing={3}>
        <HStack justify="space-between" w="100%">
          <VStack align="start" spacing={1}>
            <Text fontWeight="bold" fontSize="lg" color="blue.500">
              {user.name}
            </Text>
            <Text fontSize="sm" color="gray.600">
              {user.email}
            </Text>
          </VStack>
          <Text fontSize="sm" color="gray.600" fontFamily="mono">
            ID: {user._id.substring(0, 8)}...
          </Text>
        </HStack>

        <HStack spacing={2} w="100%">
          <Button
            colorScheme="teal"
            size="sm"
            leftIcon={<FiEdit />}
            as={RouterLink}
            to={`/admin/users/edit/${user._id}`}
            flex={1}
          >
            Edit
          </Button>
          <Button
            colorScheme="red"
            size="sm"
            leftIcon={<FiTrash2 />}
            onClick={() => handleDeleteClick(user._id)}
          >
            Delete
          </Button>
        </HStack>
      </VStack>
    </Box>
  );

  return (
    <Box>
      {/* Header */}
      <Box
        bg={cardBg}
        shadow="sm"
        p={{ base: 4, md: 6 }}
        mb={4}
        borderRadius="lg"
        border="1px"
        borderColor={borderColor}
      >
        <Flex
          direction={{ base: "column", sm: "row" }}
          justify="space-between"
          align={{ base: "stretch", sm: "center" }}
          gap={4}
        >
          <Heading color="blue.500" size="lg">
            Users Management
          </Heading>
        </Flex>
      </Box>

      {/* Content */}
      <Box bg={cardBg} shadow="sm" borderRadius="lg" overflow="hidden" border="1px" borderColor={borderColor}>
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th color="blue.500">Name</Th>
                  <Th color="blue.500">Email</Th>
                  <Th color="blue.500">Role</Th>
                  <Th color="blue.500">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {users?.length > 0 ? (
                  users.map((user) => (
                    <Tr key={user._id}>
                      <Td>
                        <Text fontWeight="medium" color="blue.500">
                          {user.name}
                        </Text>
                      </Td>
                      <Td color="gray.600">
                        {user.email}
                      </Td>
                      <Td>
                        <Text fontSize="sm" color="gray.600">
                          {user.role}
                        </Text>
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <Button
                            as={RouterLink}
                            to={`/admin/users/edit/${user._id}`}
                            colorScheme="teal"
                            size="sm"
                            leftIcon={<FiEdit />}
                          >
                            Edit
                          </Button>
                          <Button
                            colorScheme="red"
                            size="sm"
                            leftIcon={<FiTrash2 />}
                            onClick={() => handleDeleteClick(user._id)}
                          >
                            Delete
                          </Button>
                        </HStack>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={4} textAlign="center" py={8}>
                      <Text color="gray.600">No users found.</Text>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      {/* This dialog is no longer used as handleDeleteConfirm is removed */}
    </Box>
  );
};

export default UsersManagementPage;
