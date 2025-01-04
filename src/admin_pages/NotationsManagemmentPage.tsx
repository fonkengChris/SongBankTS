import React from "react";
import {
  ChakraProvider,
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
  Link,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import useNotations from "../hooks/useNotations";
import APIClient from "../services/api-client";

const NotationsManagementPage = () => {
  const { data: notations, error, isLoading, refetch } = useNotations();
  const toast = useToast();
  const notationsService = new APIClient<any>("/api/notations");

  const handleDelete = async (id: string) => {
    try {
      await notationsService.delete(id);
      refetch(); // Refresh the notations list
      toast({
        title: "Notation deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error deleting notation",
        description: "Please try again later",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (isLoading) return <Spinner />;

  if (error) return <Box>Error loading notations</Box>;

  if (!notations) return null;

  return (
    <ChakraProvider>
      <Box bg="gray.100" minHeight="100vh" p={4}>
        <Box bg="white" shadow="md" p={4} mb={4}>
          <Flex justifyContent="space-between" alignItems="center">
            <Heading color={"blue.400"} size="lg">
              Notations Management
            </Heading>
            <Button
              colorScheme="blue"
              as={RouterLink}
              to="/admin/notations/add"
            >
              Add Notation
            </Button>
          </Flex>
        </Box>

        <Box bg="white" shadow="md" p={4}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Title</Th>
                <Th>Slug</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {notations.map((notation) => (
                <Tr key={notation._id}>
                  <Td color={"blue.400"}>{notation.title}</Td>
                  <Td color={"blue.400"}>{notation.slug}</Td>
                  <Td>
                    <Button
                      as={RouterLink}
                      to={`/admin/notations/edit/${notation._id}`}
                      colorScheme="teal"
                      size="sm"
                      mr={2}
                    >
                      Edit
                    </Button>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleDelete(notation._id)}
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default NotationsManagementPage;
