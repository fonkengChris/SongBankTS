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
  Avatar,
  Tooltip,
} from "@chakra-ui/react";
import usePayments from "../hooks/usePayments";
import { FiDollarSign, FiUser, FiMusic, FiCalendar, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";
import Payment from "../entities/Payment";

const PaymentsManagementPage = () => {
  const { data: payments, error, isLoading } = usePayments();
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
    return <Box p={4}>Error loading payments: {String(error)}</Box>;
  }

  // Helper function to format currency
  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Helper function to get status color scheme
  const getStatusColorScheme = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "green";
      case "PENDING":
        return "yellow";
      case "APPROVED":
        return "blue";
      case "VOIDED":
      case "PAYER_ACTION_REQUIRED":
        return "red";
      default:
        return "gray";
    }
  };

  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return FiCheckCircle;
      case "PENDING":
        return FiClock;
      case "APPROVED":
        return FiCheckCircle;
      case "VOIDED":
      case "PAYER_ACTION_REQUIRED":
        return FiXCircle;
      default:
        return FiClock;
    }
  };

  // Helper function to get provider badge color
  const getProviderColorScheme = (provider?: string) => {
    switch (provider) {
      case "PAYPAL":
        return "blue";
      case "MTN_MOMO":
        return "yellow";
      default:
        return "gray";
    }
  };

  // Mobile card component
  const PaymentCard = ({ payment }: { payment: Payment }) => (
    <Card shadow="sm" border="1px" borderColor={borderColor} bg={cardBg}>
      <CardBody>
        <VStack align="stretch" spacing={4}>
          {/* Header with user and amount */}
          <HStack justify="space-between" align="start">
            <HStack spacing={3}>
              <Avatar 
                name={payment.user?.name || "Unknown User"} 
                size="sm" 
              />
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold" fontSize="md" color="blue.500">
                  {payment.user?.name || "Unknown User"}
                </Text>
                <Text fontSize="sm" color={secondaryTextColor}>
                  {payment.user?.email || "No email"}
                </Text>
              </VStack>
            </HStack>
            <VStack align="end" spacing={1}>
              <Text fontWeight="bold" fontSize="lg" color="green.500">
                {formatCurrency(payment.amount)}
              </Text>
              <Badge 
                colorScheme={getStatusColorScheme(payment.status)} 
                variant="subtle"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <Box as={getStatusIcon(payment.status)} size="10px" />
                {payment.status}
              </Badge>
            </VStack>
          </HStack>

          {/* Payment details */}
          <VStack align="stretch" spacing={2}>
            <HStack spacing={2}>
              <FiMusic size={14} color="#3182CE" />
              <Text fontSize="sm" color={textColor} noOfLines={2}>
                {payment.description}
              </Text>
            </HStack>
            
            {payment.paymentDetails?.provider && (
              <HStack spacing={2}>
                <FiDollarSign size={14} color="#3182CE" />
                <Badge 
                  colorScheme={getProviderColorScheme(payment.paymentDetails.provider)}
                  variant="outline"
                  fontSize="xs"
                >
                  {payment.paymentDetails.provider}
                </Badge>
                {payment.paymentDetails.purchaseType && (
                  <Badge colorScheme="purple" variant="outline" fontSize="xs">
                    {payment.paymentDetails.purchaseType}
                  </Badge>
                )}
              </HStack>
            )}

            <HStack spacing={2}>
              <FiCalendar size={14} color="#3182CE" />
              <Text fontSize="sm" color={secondaryTextColor}>
                {formatDate(payment.createdAt)}
              </Text>
            </HStack>

            <HStack spacing={2}>
              <Text fontSize="xs" color={secondaryTextColor}>
                Order ID: {payment.orderId}
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  );

  // Calculate totals
  const totalRevenue = payments?.reduce((sum, payment) => 
    payment.status === "COMPLETED" ? sum + payment.amount : sum, 0) || 0;
  const totalTransactions = payments?.length || 0;
  const completedTransactions = payments?.filter(p => p.status === "COMPLETED").length || 0;

  return (
    <Box>
      {/* Header with stats */}
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
          mb={4}
        >
          <Heading color="blue.500" size="lg">
            Payments Management
          </Heading>
        </Flex>

        {/* Stats cards */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <Card bg="green.50" borderColor="green.200" border="1px">
            <CardBody>
              <HStack>
                <Box color="green.500">
                  <FiDollarSign size={24} />
                </Box>
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" color="green.600">Total Revenue</Text>
                  <Text fontSize="xl" fontWeight="bold" color="green.700">
                    {formatCurrency(totalRevenue)}
                  </Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>

          <Card bg="blue.50" borderColor="blue.200" border="1px">
            <CardBody>
              <HStack>
                <Box color="blue.500">
                  <FiCheckCircle size={24} />
                </Box>
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" color="blue.600">Completed</Text>
                  <Text fontSize="xl" fontWeight="bold" color="blue.700">
                    {completedTransactions}
                  </Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>

          <Card bg="purple.50" borderColor="purple.200" border="1px">
            <CardBody>
              <HStack>
                <Box color="purple.500">
                  <FiUser size={24} />
                </Box>
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" color="purple.600">Total Transactions</Text>
                  <Text fontSize="xl" fontWeight="bold" color="purple.700">
                    {totalTransactions}
                  </Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Box>

      {/* Content */}
      <Box bg={cardBg} shadow="sm" borderRadius="lg" overflow="hidden" border="1px" borderColor={borderColor}>
        {isMobile ? (
          // Mobile layout with cards
          <Box p={4}>
            <SimpleGrid columns={1} spacing={4}>
              {payments && payments.length > 0 ? (
                payments.map((payment) => (
                  <PaymentCard key={payment._id} payment={payment} />
                ))
              ) : (
                <Box textAlign="center" py={8}>
                  <Text color={secondaryTextColor}>No payments found.</Text>
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
                      <FiUser />
                      <Text>User</Text>
                    </HStack>
                  </Th>
                  <Th color="blue.500">
                    <HStack spacing={2}>
                      <FiDollarSign />
                      <Text>Amount</Text>
                    </HStack>
                  </Th>
                  <Th color="blue.500">Description</Th>
                  <Th color="blue.500">Status</Th>
                  <Th color="blue.500">Provider</Th>
                  <Th color="blue.500">
                    <HStack spacing={2}>
                      <FiCalendar />
                      <Text>Date</Text>
                    </HStack>
                  </Th>
                  <Th color="blue.500">Order ID</Th>
                </Tr>
              </Thead>
              <Tbody>
                {payments && payments.length > 0 ? (
                  payments.map((payment) => (
                    <Tr key={payment._id}>
                      <Td>
                        <HStack spacing={3}>
                          <Avatar 
                            name={payment.user?.name || "Unknown User"} 
                            size="sm" 
                          />
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="medium" color="blue.500">
                              {payment.user?.name || "Unknown User"}
                            </Text>
                            <Text fontSize="sm" color={secondaryTextColor}>
                              {payment.user?.email || "No email"}
                            </Text>
                          </VStack>
                        </HStack>
                      </Td>
                      <Td>
                        <Text fontWeight="bold" color="green.500">
                          {formatCurrency(payment.amount)}
                        </Text>
                      </Td>
                      <Td>
                        <Tooltip label={payment.description}>
                          <Text noOfLines={2} maxW="200px">
                            {payment.description}
                          </Text>
                        </Tooltip>
                      </Td>
                      <Td>
                        <Badge 
                          colorScheme={getStatusColorScheme(payment.status)} 
                          variant="subtle"
                          display="flex"
                          alignItems="center"
                          gap={1}
                          w="fit-content"
                        >
                          <Box as={getStatusIcon(payment.status)} size="10px" />
                          {payment.status}
                        </Badge>
                      </Td>
                      <Td>
                        <VStack align="start" spacing={1}>
                          {payment.paymentDetails?.provider && (
                            <Badge 
                              colorScheme={getProviderColorScheme(payment.paymentDetails.provider)}
                              variant="outline"
                              fontSize="xs"
                            >
                              {payment.paymentDetails.provider}
                            </Badge>
                          )}
                          {payment.paymentDetails?.purchaseType && (
                            <Badge colorScheme="purple" variant="outline" fontSize="xs">
                              {payment.paymentDetails.purchaseType}
                            </Badge>
                          )}
                        </VStack>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color={textColor}>
                          {formatDate(payment.createdAt)}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="xs" color={secondaryTextColor} fontFamily="mono">
                          {payment.orderId}
                        </Text>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={7} textAlign="center" py={8}>
                      <Text color={secondaryTextColor}>No payments found.</Text>
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

export default PaymentsManagementPage;
