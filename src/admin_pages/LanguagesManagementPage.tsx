import React from "react";
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
  Link,
  useToast,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import useLanguages from "../hooks/useLanguages";
import APIClient from "../services/api-client";

const LanguagesManagementPage = () => {
  // Sample data
  const { data: languages, error, refetch } = useLanguages();
  const toast = useToast();

  const handleDelete = async (id: string) => {
    try {
      await new APIClient("/api/languages").delete(id);
      toast({
        title: "Language deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      refetch(); // Refresh the languages list
    } catch (error) {
      toast({
        title: "Error deleting language",
        description: "Please try again later",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box bg="gray.100" minHeight="100vh" p={4}>
      <Box bg="white" shadow="md" p={4} mb={4}>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading color={"blue.400"} size="lg">
            Languages Management
          </Heading>
          <Button colorScheme="blue" as={RouterLink} to="/admin/languages/add">
            Add language
          </Button>
        </Flex>
      </Box>

      <Box bg="white" shadow="md" p={4}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>code</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {languages?.map((language) => (
              <Tr key={language._id}>
                <Td color={"blue.400"}>{language.name}</Td>
                <Td color={"blue.400"}>{language.code}</Td>
                <Td>
                  <Button
                    as={RouterLink}
                    to={`/admin/languages/edit/${language._id}`}
                    colorScheme="teal"
                    size="sm"
                    mr={2}
                  >
                    Edit
                  </Button>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleDelete(language._id)}
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
  );
};

export default LanguagesManagementPage;
