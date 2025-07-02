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
} from "@chakra-ui/react";
import { Link as RouterLink, Navigate } from "react-router-dom";
import useUsers from "../hooks/useUsers"; // Custom hook to fetch users data
import User from "../entities/User"; // Define your User interface/entity here
import APIClient from "../services/api-client";
import jwtDecode from "jwt-decode";
import CurrentUser from "../entities/CurrentUser";

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

  return (
    <Box bg="gray.100" minHeight="100vh" p={4}>
      <Box bg="white" shadow="md" p={4} mb={4}>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading color={"blue.400"} size="lg">
            Users Management
          </Heading>
          <Button colorScheme="blue" as={RouterLink} to="/admin/users/add">
            Add User
          </Button>
        </Flex>
      </Box>

      <Box bg="white" shadow="md" p={4}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users?.length > 0 ? (
              users.map((user) => (
                <Tr key={user._id}>
                  <Td color={"blue.400"}>{user._id}</Td>
                  <Td color={"blue.400"}>{user.name}</Td>
                  <Td color={"blue.400"}>{user.email}</Td>
                  <Td color={"blue.400"}>{user.role}</Td>
                  <Td>
                    <Button
                      colorScheme="teal"
                      size="sm"
                      mr={2}
                      as={RouterLink}
                      to={`/admin/users/edit/${user._id}`}
                    >
                      Edit
                    </Button>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleDeleteClick(user._id)}
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={5} textAlign="center">
                  No users found.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>

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
              <Button
                ref={cancelRef}
                onClick={() => setIsDeleteDialogOpen(false)}
              >
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
