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
  useBreakpointValue,
  Text,
  Card,
  CardBody,
  SimpleGrid,
  HStack,
  VStack,
  Badge,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import useLanguages from "../hooks/useLanguages";
import APIClient from "../services/api-client";
import { FiEdit, FiTrash2, FiGlobe } from "react-icons/fi";

const LanguagesManagementPage = () => {
  // Sample data
  const { data: languages, error, refetch, isLoading } = useLanguages();
  const toast = useToast();

  // Responsive breakpoints
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Color mode values for better visibility
  const textColor = useColorModeValue("gray.800", "gray.100");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.300");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  if (isLoading) {
    return (
      <Box p={4} display="flex" justifyContent="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return <Box p={4}>Error loading languages: {String(error)}</Box>;
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this language?"))
      return;

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

  // Mobile card component
  const LanguageCard = ({ language }: { language: any }) => (
    <Card shadow="sm" border="1px" borderColor={borderColor} bg={cardBg}>
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <HStack justify="space-between">
            <HStack spacing={3}>
              <FiGlobe size={20} color="#3182CE" />
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold" fontSize="lg" color="blue.500">
                  {language.name}
                </Text>
                <Badge colorScheme="green" variant="subtle">
                  {language.code}
                </Badge>
              </VStack>
            </HStack>
          </HStack>

          <HStack spacing={2}>
            <Button
              colorScheme="teal"
              size="sm"
              leftIcon={<FiEdit />}
              as={RouterLink}
              to={`/admin/languages/edit/${language._id}`}
              flex={1}
            >
              Edit
            </Button>
            <Button
              colorScheme="red"
              size="sm"
              leftIcon={<FiTrash2 />}
              onClick={() => handleDelete(language._id)}
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
            Languages Management
          </Heading>
          <Button
            colorScheme="blue"
            as={RouterLink}
            to="/admin/languages/add"
            size={{ base: "md", md: "lg" }}
          >
            Add Language
          </Button>
        </Flex>
      </Box>

      {/* Content */}
      <Box bg={cardBg} shadow="sm" borderRadius="lg" overflow="hidden" border="1px" borderColor={borderColor}>
        {isMobile ? (
          // Mobile layout with cards
          <Box p={4}>
            <SimpleGrid columns={1} spacing={4}>
              {languages && languages.length > 0 ? (
                languages.map((language) => (
                  <LanguageCard key={language._id} language={language} />
                ))
              ) : (
                <Box textAlign="center" py={8}>
                  <Text color={secondaryTextColor}>No languages found.</Text>
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
                  <Th color="blue.500">
                    <HStack spacing={2}>
                      <FiGlobe />
                      <Text>Name</Text>
                    </HStack>
                  </Th>
                  <Th color="blue.500">Code</Th>
                  <Th color="blue.500">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {languages && languages.length > 0 ? (
                  languages.map((language) => (
                    <Tr key={language._id}>
                      <Td color="blue.500" fontWeight="medium">
                        {language.name}
                      </Td>
                      <Td>
                        <Badge colorScheme="green" variant="subtle">
                          {language.code}
                        </Badge>
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <Button
                            as={RouterLink}
                            to={`/admin/languages/edit/${language._id}`}
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
                            onClick={() => handleDelete(language._id)}
                          >
                            Delete
                          </Button>
                        </HStack>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={3} textAlign="center" py={8}>
                      <Text color={secondaryTextColor}>No languages found.</Text>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default LanguagesManagementPage;
