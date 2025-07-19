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
  Spinner,
  useToast,
  useBreakpointValue,
  Text,
  Badge,
  Card,
  CardBody,
  SimpleGrid,
  HStack,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import useNotations from "../hooks/useNotations";
import APIClient from "../services/api-client";
import { FiEdit, FiTrash2, FiFileText } from "react-icons/fi";

const NotationsManagementPage = () => {
  const { data: notations, error, isLoading, refetch } = useNotations();
  const toast = useToast();
  const notationsService = new APIClient<any>("/api/notations");

  // Responsive breakpoints
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Color mode values for better visibility
  const textColor = useColorModeValue("gray.800", "gray.100");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.300");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this notation?")) return;

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

  if (isLoading) {
    return (
      <Box p={4} display="flex" justifyContent="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return <Box p={4}>Error loading notations: {String(error)}</Box>;
  }

  // Mobile card component
  const NotationCard = ({ notation }: { notation: any }) => (
    <Card shadow="sm" border="1px" borderColor={borderColor} bg={cardBg}>
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <HStack justify="space-between">
            <HStack spacing={3}>
              <FiFileText size={20} color="#3182CE" />
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold" fontSize="lg" color="blue.500">
                  {notation.title}
                </Text>
                <Text fontSize="sm" color={secondaryTextColor} fontFamily="mono">
                  {notation.slug}
                </Text>
              </VStack>
            </HStack>
          </HStack>

          <HStack spacing={2}>
            <Button
              colorScheme="teal"
              size="sm"
              leftIcon={<FiEdit />}
              as={RouterLink}
              to={`/admin/notations/edit/${notation._id}`}
              flex={1}
            >
              Edit
            </Button>
            <Button
              colorScheme="red"
              size="sm"
              leftIcon={<FiTrash2 />}
              onClick={() => handleDelete(notation._id)}
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
            Notations Management
          </Heading>
          <Button
            colorScheme="blue"
            as={RouterLink}
            to="/admin/notations/add"
            size={{ base: "md", md: "lg" }}
          >
            Add Notation
          </Button>
        </Flex>
      </Box>

      {/* Content */}
      <Box bg={cardBg} shadow="sm" borderRadius="lg" overflow="hidden" border="1px" borderColor={borderColor}>
        {isMobile ? (
          // Mobile layout with cards
          <Box p={4}>
            <SimpleGrid columns={1} spacing={4}>
              {notations && notations.length > 0 ? (
                notations.map((notation) => (
                  <NotationCard key={notation._id} notation={notation} />
                ))
              ) : (
                <Box textAlign="center" py={8}>
                  <Text color={secondaryTextColor}>No notations found.</Text>
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
                      <FiFileText />
                      <Text>Title</Text>
                    </HStack>
                  </Th>
                  <Th color="blue.500">Slug</Th>
                  <Th color="blue.500">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {notations && notations.length > 0 ? (
                  notations.map((notation) => (
                    <Tr key={notation._id}>
                      <Td>
                        <Text fontWeight="medium" color="blue.500">
                          {notation.title}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color={secondaryTextColor} fontFamily="mono">
                          {notation.slug}
                        </Text>
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <Button
                            as={RouterLink}
                            to={`/admin/notations/edit/${notation._id}`}
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
                            onClick={() => handleDelete(notation._id)}
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
                      <Text color={secondaryTextColor}>No notations found.</Text>
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

export default NotationsManagementPage;
