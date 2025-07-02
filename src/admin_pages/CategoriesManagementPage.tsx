import React, { useState } from "react";
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
import { Link as RouterLink } from "react-router-dom";
import useCategories from "../hooks/useCategories";
import APIClient from "../services/api-client";
import Category from "../entities/Category";

const CategoriesManagementPage = () => {
  const { data: categories, isLoading, error, refetch } = useCategories();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const toast = useToast();
  const apiClient = new APIClient<Category>("/api/categories");

  const handleDeleteClick = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      await apiClient.delete(categoryToDelete);
      await refetch(); // Refresh the categories list
      toast({
        title: "Category deleted successfully",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error deleting category",
        description:
          error instanceof Error ? error.message : "An error occurred",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <Box bg="gray.100" minHeight="100vh" p={4}>
      <Box bg="white" shadow="md" p={4} mb={4}>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading color="blue.400" size="lg">
            Categories Management
          </Heading>
          <Button colorScheme="blue" as={RouterLink} to="/admin/categories/add">
            Add category
          </Button>
        </Flex>
      </Box>

      <Box bg="white" shadow="md" p={4}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {categories?.map((category) => (
              <Tr key={category._id}>
                <Td color="blue.400">{category.title}</Td>
                <Td>
                  <Button
                    as={RouterLink}
                    to={`/admin/categories/edit/${category._id}`}
                    colorScheme="teal"
                    size="sm"
                    mr={2}
                  >
                    Edit
                  </Button>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleDeleteClick(category._id)}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
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
              Delete Category
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

export default CategoriesManagementPage;
