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
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import useCustomers from "../hooks/useCustomers";
import Customer from "../entities/Customer";
import APIClient from "../services/api-client";

const CustomersManagementPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const apiClient = new APIClient<Customer>("/api/customers");
  const toast = useToast();

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
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg" color="gray.700">
          Customers Management
        </Heading>
        <Button
          colorScheme="blue"
          as={RouterLink}
          to="/admin/customers/add"
          size="sm"
        >
          Add Customer
        </Button>
      </Flex>

      <Box bg="white" borderRadius="lg" shadow="sm" overflow="hidden">
        <Table variant="simple">
          <Thead>
            <Tr bg="gray.50">
              <Th>Name</Th>
              <Th>Country</Th>
              <Th width="200px">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {customers?.length > 0 ? (
              customers.map((customer) => (
                <Tr key={customer._id}>
                  <Td fontWeight="medium" color="blue.600">
                    {customer.user ? customer.user.name : "No Name Available"}
                  </Td>
                  <Td color="blue.600">{customer.country || "N/A"}</Td>
                  <Td>
                    <Button
                      as={RouterLink}
                      to={`/admin/customers/edit/${customer._id}`}
                      colorScheme="teal"
                      size="sm"
                      mr={2}
                    >
                      Edit
                    </Button>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleDelete(customer._id!)}
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={4} textAlign="center" py={8} color="gray.500">
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
