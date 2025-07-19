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
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import useCustomers from "../hooks/useCustomers";
import Customer from "../entities/Customer";
import APIClient from "../services/api-client";

const CustomersManagementPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const apiClient = new APIClient<Customer>("/api/customers");
  const toast = useToast();

  // Color mode values for consistent styling
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const headerBgColor = useColorModeValue("gray.50", "gray.700");
  const headerTextColor = useColorModeValue("blue.500", "blue.300");
  const tableRowHoverBg = useColorModeValue("gray.50", "gray.700");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customerList = await useCustomers();
        setCustomers(customerList || []);
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast({
          title: "Error fetching customers",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchCustomers();
  }, []);

  async function handleDelete(customerId: string) {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await apiClient.delete(customerId);
        setCustomers(
          customers.filter((customer) => customer._id !== customerId)
        );
        toast({
          title: "Customer deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Error deleting customer:", error);
        toast({
          title: "Error deleting customer",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  }

  return (
    <Box p={6}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg" color="blue.500" fontWeight="bold">
          Customers Management
        </Heading>
        <Button
          colorScheme="blue"
          as={RouterLink}
          to="/admin/customers/add"
          size="sm"
          _hover={{ transform: "translateY(-1px)", boxShadow: "lg" }}
          transition="all 0.2s"
        >
          Add Customer
        </Button>
      </Flex>

      <Box 
        bg={bgColor} 
        borderRadius="lg" 
        shadow="md" 
        overflow="hidden"
        border="1px solid"
        borderColor={borderColor}
      >
        <Table variant="simple">
          <Thead>
            <Tr bg={headerBgColor}>
              <Th color={headerTextColor} fontWeight="semibold" py={4}>Name</Th>
              <Th color={headerTextColor} fontWeight="semibold" py={4}>Country</Th>
              <Th color={headerTextColor} fontWeight="semibold" py={4} width="200px">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {customers?.length > 0 ? (
              customers.map((customer) => (
                <Tr 
                  key={customer._id}
                  _hover={{ bg: tableRowHoverBg }}
                  transition="background-color 0.2s"
                >
                  <Td fontWeight="medium" color="blue.500" py={4}>
                    {customer.user ? customer.user.name : "No Name Available"}
                  </Td>
                  <Td color={textColor} py={4}>{customer.country || "N/A"}</Td>
                  <Td py={4}>
                    <Button
                      as={RouterLink}
                      to={`/admin/customers/edit/${customer._id}`}
                      colorScheme="teal"
                      size="sm"
                      mr={2}
                      _hover={{ transform: "translateY(-1px)", boxShadow: "md" }}
                      transition="all 0.2s"
                    >
                      Edit
                    </Button>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleDelete(customer._id!)}
                      _hover={{ transform: "translateY(-1px)", boxShadow: "md" }}
                      transition="all 0.2s"
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={4} textAlign="center" py={12} color="gray.500">
                  No customers found.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default CustomersManagementPage;
