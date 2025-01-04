import React from "react";
import { ChakraProvider, Box, Heading, Flex, Button } from "@chakra-ui/react";
import CategoryForm from "../components/CategoryForm";
import { useParams, useNavigate } from "react-router-dom";

const CategoryFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <ChakraProvider>
      <Box bg="gray.100" minHeight="100vh" p={4}>
        <Box bg="white" shadow="md" p={4} mb={4}>
          <Flex justifyContent="space-between" alignItems="center">
            <Heading color="blue.400" size="lg">
              {id ? "Edit Category" : "Create Category"}
            </Heading>
          </Flex>
        </Box>

        <CategoryForm />
      </Box>
    </ChakraProvider>
  );
};

export default CategoryFormPage;
