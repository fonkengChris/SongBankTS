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
import jwtDecode from "jwt-decode";
import CurrentUser from "../entities/CurrentUser";
import { FiMoreVertical, FiEdit, FiTrash2 } from "react-icons/fi";

const UsersManagementPage = () => {
  // Add authorization check at the top of the component
  const jwt = localStorage.getItem("token");
  const user = jwtDecode<CurrentUser>(jwt!);

  if (user.role !== "superAdmin") {
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
    setUserToDelete(userId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      await apiClient.delete(userToDelete);
      setUsers(users.filter((user) => user._id !== userToDelete));
      toast({
        title: "User deleted successfully",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error deleting user",
        description:
          error instanceof Error ? error.message : "An error occurred",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  // Mobile card component
  const UserCard = ({ user }: { user: User }) => (
    <Card shadow="sm" border="1px" borderColor={borderColor} bg={cardBg}>
      <CardBody>
        <VStack align="stretch" spacing={3}>
          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold" fontSize="lg" color="blue.500">
                {user.name}
              </Text>
              <Text fontSize="sm" color={secondaryTextColor}>
                {user.email}
              </Text>
            </VStack>
            <Badge
              colorScheme={user.role === "superAdmin" ? "red" : "blue"}
              variant="subtle"
            >
              {user.role}
            </Badge>
          </HStack>

          <Text fontSize="xs" color={secondaryTextColor} fontFamily="mono">
            ID: {user._id.substring(0, 8)}...
          </Text>

          <HStack spacing={2}>
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
      </CardBody>
    </Card>
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
          <Button
            colorScheme="blue"
            as={RouterLink}
            to="/admin/users/add"
            size={{ base: "md", md: "lg" }}
          >
            Add User
          </Button>
        </Flex>
      </Box>

      {/* Content */}
      <Box bg={cardBg} shadow="sm" borderRadius="lg" overflow="hidden" border="1px" borderColor={borderColor}>
        {isMobile ? (
          // Mobile layout with cards
          <Box p={4}>
            <SimpleGrid columns={1} spacing={4}>
              {users?.length > 0 ? (
                users.map((user) => <UserCard key={user._id} user={user} />)
              ) : (
                <Box textAlign="center" py={8}>
                  <Text color={secondaryTextColor}>No users found.</Text>
                </Box>
              )}
            </SimpleGrid>
          </Box>
        ) : (
          // Desktop/Tablet layout with table
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
                      <Td color={secondaryTextColor}>
                        {user.email}
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={user.role === "superAdmin" ? "red" : "blue"}
                          variant="subtle"
                        >
                          {user.role}
                        </Badge>
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
                      <Text color={secondaryTextColor}>No users found.</Text>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete User
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default UsersManagementPage;
