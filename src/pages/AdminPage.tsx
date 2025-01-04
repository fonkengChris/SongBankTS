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
  VStack,
  Flex,
  HStack,
  Icon,
  Text,
  Button,
  Avatar,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiFolder,
  FiMusic,
  FiFile,
  FiGlobe,
  FiDatabase,
  FiUserPlus,
  FiArrowLeft,
} from "react-icons/fi";
import jwtDecode from "jwt-decode";
import CurrentUser from "../entities/CurrentUser";

const AdminPage: React.FC = () => {
  const jwt = localStorage.getItem("token");
  const user = jwtDecode<CurrentUser>(jwt!);
  const navigate = useNavigate();

  if (user.role === "regular") return <Navigate to="/songs" />;
  return (
    <Flex h="100vh">
      {/* Sidebar - Darker blue */}
      <Box w="250px" bg="blue.950" p={4}>
        <Heading size="md" mb={8} color="white">
          Admin Dashboard
        </Heading>

        <Button
          leftIcon={<FiArrowLeft />}
          colorScheme="blue"
          variant="outline"
          color="white"
          _hover={{ bg: "blue.800" }}
          mb={6}
          onClick={() => navigate("/songs")}
          w="full"
        >
          Return to Songs
        </Button>

        <VStack align="stretch" spacing={6}>
          {/* Authentication Section - Only show for superAdmin */}
          {user.role === "superAdmin" && (
            <Box>
              <Text
                fontSize="sm"
                color="whiteAlpha.700"
                mb={3}
                fontWeight="medium"
              >
                AUTHENTICATION
              </Text>
              <VStack align="stretch" spacing={1}>
                <Link to="/admin/users">
                  <HStack
                    p={2}
                    borderRadius="md"
                    _hover={{ bg: "blue.800" }}
                    color="whiteAlpha.900"
                  >
                    <Icon as={FiUsers} />
                    <Text>Users</Text>
                  </HStack>
                </Link>
                <Link to="/admin/customers">
                  <HStack
                    p={2}
                    borderRadius="md"
                    _hover={{ bg: "blue.800" }}
                    color="whiteAlpha.900"
                  >
                    <Icon as={FiUserPlus} />
                    <Text>Customers</Text>
                  </HStack>
                </Link>
              </VStack>
            </Box>
          )}

          {/* Library Section */}
          <Box>
            <Text
              fontSize="sm"
              color="whiteAlpha.700"
              mb={3}
              fontWeight="medium"
            >
              LIBRARY
            </Text>
            <VStack align="stretch" spacing={1}>
              <Link to="/admin/category">
                <HStack
                  p={2}
                  borderRadius="md"
                  _hover={{ bg: "blue.800" }}
                  color="whiteAlpha.900"
                >
                  <Icon as={FiFolder} />
                  <Text>Categories</Text>
                </HStack>
              </Link>
              <Link to="/admin/songs">
                <HStack
                  p={2}
                  borderRadius="md"
                  _hover={{ bg: "blue.800" }}
                  color="whiteAlpha.900"
                >
                  <Icon as={FiMusic} />
                  <Text>Songs</Text>
                </HStack>
              </Link>
              <Link to="/admin/notations">
                <HStack
                  p={2}
                  borderRadius="md"
                  _hover={{ bg: "blue.800" }}
                  color="whiteAlpha.900"
                >
                  <Icon as={FiFile} />
                  <Text>Notations</Text>
                </HStack>
              </Link>
              <Link to="/admin/languages">
                <HStack
                  p={2}
                  borderRadius="md"
                  _hover={{ bg: "blue.800" }}
                  color="whiteAlpha.900"
                >
                  <Icon as={FiGlobe} />
                  <Text>Languages</Text>
                </HStack>
              </Link>
              <Link to="/admin/media_files">
                <HStack
                  p={2}
                  borderRadius="md"
                  _hover={{ bg: "blue.800" }}
                  color="whiteAlpha.900"
                >
                  <Icon as={FiDatabase} />
                  <Text>Media Files</Text>
                </HStack>
              </Link>
            </VStack>
          </Box>
        </VStack>
      </Box>

      {/* Main Content Area - Slightly darker blue background */}
      <Box flex={1} bg="blue.100" p={8} overflowY="auto">
        {/* Add welcome navbar */}
        <Box bg="white" p={4} borderRadius="lg" mb={4} boxShadow="sm">
          <Flex align="center">
            <HStack spacing={4}>
              <Wrap>
                <WrapItem>
                  <Avatar name={user.name} size="sm" />
                </WrapItem>
              </Wrap>
              <Heading
                size="md"
                color="blue.600"
                fontSize="5xl"
                textAlign="center"
                marginY={5}
              >
                Welcome, {user.name}
              </Heading>
            </HStack>
            {/* <ColorModeSwitch /> */}
          </Flex>
          <br />
          <Text fontSize={"2xl"} color="blue.600">
            Select an option from the sidebar
          </Text>
        </Box>

        {/* Main content box */}
        <Box
          bg="white"
          borderRadius="lg"
          p={6}
          boxShadow="sm"
          minH="calc(100vh - 8rem)"
        >
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
};

export default AdminPage;
