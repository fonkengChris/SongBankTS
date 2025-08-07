import React, { useState, useEffect } from "react";
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
  Select,
  useBreakpointValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  IconButton,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  Link,
  Navigate,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  FiUsers,
  FiFolder,
  FiMusic,
  FiFile,
  FiGlobe,
  FiDatabase,
  FiUserPlus,
  FiArrowLeft,
  FiMenu,
  FiVideo,
  FiEdit3,
  FiDollarSign,
} from "react-icons/fi";
import jwtDecode from "jwt-decode";
import CurrentUser from "../entities/CurrentUser";
import Footer from "../components/Footer";
import { getValidToken, decodeToken } from "../utils/jwt-validator";

const AdminPage: React.FC = () => {
  const [user, setUser] = useState({} as CurrentUser);
  const [selectedRoute, setSelectedRoute] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      const token = getValidToken();
      if (token) {
        const decodedToken = decodeToken(token);
        if (decodedToken) {
          setUser(decodedToken as CurrentUser);
        }
      }
    } catch (error) {
      console.error("Error setting user from token:", error);
    }
  }, []);

  const jwt = getValidToken();
  if (!jwt) return <Navigate to="/auth" />;

  // Responsive breakpoints
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isTablet = useBreakpointValue({ base: false, md: true, lg: false });

  if (user.role === "regular") return <Navigate to="/songs" />;

  // Navigation options
  const navigationOptions = [
    // Authentication options (superAdmin only)
    ...(user.role === "superAdmin"
      ? [
          {
            path: "/admin/users",
            label: "Users",
            icon: FiUsers,
            section: "AUTHENTICATION",
          },
          {
            path: "/admin/customers",
            label: "Customers",
            icon: FiUserPlus,
            section: "AUTHENTICATION",
          },
        ]
      : []),
    // Library options
    {
      path: "/admin/category",
      label: "Categories",
      icon: FiFolder,
      section: "LIBRARY",
    },
    { path: "/admin/songs", label: "Songs", icon: FiMusic, section: "LIBRARY" },
    {
      path: "/admin/notations",
      label: "Notations",
      icon: FiFile,
      section: "LIBRARY",
    },
    {
      path: "/admin/languages",
      label: "Languages",
      icon: FiGlobe,
      section: "LIBRARY",
    },
    {
      path: "/admin/media_files",
      label: "Media Files",
      icon: FiDatabase,
      section: "LIBRARY",
    },
    {
      path: "/admin/videos",
      label: "Videos",
      icon: FiVideo,
      section: "LIBRARY",
    },
    {
      path: "/admin/blog",
      label: "Blog",
      icon: FiEdit3,
      section: "LIBRARY",
    },
    // Payments section - only show for superAdmin
    ...(user.role === "superAdmin"
      ? [
          {
            path: "/admin/payments",
            label: "Payments",
            icon: FiDollarSign,
            section: "PAYMENTS",
          },
        ]
      : []),
  ];

  // Handle navigation change
  const handleNavigationChange = (path: string) => {
    setSelectedRoute(path);
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  // Get current route label for selector
  const getCurrentRouteLabel = () => {
    const currentOption = navigationOptions.find(
      (option) => option.path === location.pathname
    );
    return currentOption ? currentOption.label : "Select an option";
  };

  // Sidebar component
  const Sidebar = () => (
    <VStack align="stretch" spacing={6}>
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

      {/* Authentication Section - Only show for superAdmin */}
      {user.role === "superAdmin" && (
        <Box>
          <Text fontSize="sm" color="whiteAlpha.700" mb={3} fontWeight="medium">
            AUTHENTICATION
          </Text>
          <VStack align="stretch" spacing={1}>
            <Button
              variant="ghost"
              justifyContent="flex-start"
              leftIcon={<Icon as={FiUsers} />}
              color="whiteAlpha.900"
              _hover={{ bg: "blue.800" }}
              onClick={() => handleNavigationChange("/admin/users")}
              isActive={location.pathname === "/admin/users"}
            >
              Users
            </Button>
            <Button
              variant="ghost"
              justifyContent="flex-start"
              leftIcon={<Icon as={FiUserPlus} />}
              color="whiteAlpha.900"
              _hover={{ bg: "blue.800" }}
              onClick={() => handleNavigationChange("/admin/customers")}
              isActive={location.pathname === "/admin/customers"}
            >
              Customers
            </Button>
          </VStack>
        </Box>
      )}

      {/* Library Section */}
      <Box>
        <Text fontSize="sm" color="whiteAlpha.700" mb={3} fontWeight="medium">
          LIBRARY
        </Text>
        <VStack align="stretch" spacing={1}>
          <Button
            variant="ghost"
            justifyContent="flex-start"
            leftIcon={<Icon as={FiFolder} />}
            color="whiteAlpha.900"
            _hover={{ bg: "blue.800" }}
            onClick={() => handleNavigationChange("/admin/category")}
            isActive={location.pathname === "/admin/category"}
          >
            Categories
          </Button>
          <Button
            variant="ghost"
            justifyContent="flex-start"
            leftIcon={<Icon as={FiMusic} />}
            color="whiteAlpha.900"
            _hover={{ bg: "blue.800" }}
            onClick={() => handleNavigationChange("/admin/songs")}
            isActive={location.pathname === "/admin/songs"}
          >
            Songs
          </Button>
          <Button
            variant="ghost"
            justifyContent="flex-start"
            leftIcon={<Icon as={FiFile} />}
            color="whiteAlpha.900"
            _hover={{ bg: "blue.800" }}
            onClick={() => handleNavigationChange("/admin/notations")}
            isActive={location.pathname === "/admin/notations"}
          >
            Notations
          </Button>
          <Button
            variant="ghost"
            justifyContent="flex-start"
            leftIcon={<Icon as={FiGlobe} />}
            color="whiteAlpha.900"
            _hover={{ bg: "blue.800" }}
            onClick={() => handleNavigationChange("/admin/languages")}
            isActive={location.pathname === "/admin/languages"}
          >
            Languages
          </Button>
          <Button
            variant="ghost"
            justifyContent="flex-start"
            leftIcon={<Icon as={FiDatabase} />}
            color="whiteAlpha.900"
            _hover={{ bg: "blue.800" }}
            onClick={() => handleNavigationChange("/admin/media_files")}
            isActive={location.pathname === "/admin/media_files"}
          >
            Media Files
          </Button>
          <Button
            variant="ghost"
            justifyContent="flex-start"
            leftIcon={<Icon as={FiVideo} />}
            color="whiteAlpha.900"
            _hover={{ bg: "blue.800" }}
            onClick={() => handleNavigationChange("/admin/videos")}
            isActive={location.pathname === "/admin/videos"}
          >
            Videos
          </Button>
          <Button
            variant="ghost"
            justifyContent="flex-start"
            leftIcon={<Icon as={FiEdit3} />}
            color="whiteAlpha.900"
            _hover={{ bg: "blue.800" }}
            onClick={() => handleNavigationChange("/admin/blog")}
            isActive={location.pathname === "/admin/blog"}
          >
            Blog
          </Button>
        </VStack>
      </Box>

      {/* Payments Section - Only show for superAdmin */}
      {user.role === "superAdmin" && (
        <Box>
          <Text fontSize="sm" color="whiteAlpha.700" mb={3} fontWeight="medium">
            PAYMENTS
          </Text>
          <VStack align="stretch" spacing={1}>
            <Button
              variant="ghost"
              justifyContent="flex-start"
              leftIcon={<Icon as={FiDollarSign} />}
              color="whiteAlpha.900"
              _hover={{ bg: "blue.800" }}
              onClick={() => handleNavigationChange("/admin/payments")}
              isActive={location.pathname === "/admin/payments"}
            >
              Payments
            </Button>
          </VStack>
        </Box>
      )}
    </VStack>
  );

  return (
    <Flex direction="column" minH="100vh">
      <Flex flex="1">
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <Box
          w={{ base: "0", lg: "250px" }}
          bg="blue.950"
          p={4}
          display={{ base: "none", lg: "block" }}
        >
          <Heading size="md" mb={8} color="white">
            Admin Dashboard
          </Heading>
          <Sidebar />
        </Box>

        {/* Main Content Area */}
        <Box
          flex={1}
          bg="blue.100"
          p={{ base: 4, md: 6, lg: 8 }}
          overflowY="auto"
        >
          {/* Mobile Header with Menu Button and Selector */}
          <Box bg="white" p={4} borderRadius="lg" mb={4} boxShadow="sm">
            {/* First line: Avatar, Welcome message, and Menu button */}
            <Flex
              align="center"
              justify="space-between"
              mb={{ base: 4, lg: 0 }}
            >
              <HStack spacing={4}>
                <Wrap>
                  <WrapItem>
                    <Avatar name={user.name} size="sm" />
                  </WrapItem>
                </Wrap>
                <Heading
                  size="md"
                  color="blue.600"
                  fontSize={{ base: "2xl", md: "3xl", lg: "5xl" }}
                  textAlign="center"
                >
                  Welcome, {user.name}
                </Heading>
              </HStack>

              {/* Mobile Menu Button */}
              <IconButton
                aria-label="Open menu"
                icon={<FiMenu />}
                onClick={onOpen}
                display={{ base: "flex", lg: "none" }}
                colorScheme="blue"
                variant="outline"
              />
            </Flex>

            {/* Second line: Navigation Selector for Mobile/Tablet */}
            <Box display={{ base: "block", lg: "none" }} mb={4}>
              <Select
                value={location.pathname}
                onChange={(e) => handleNavigationChange(e.target.value)}
                placeholder="Select an option"
                size="lg"
                bg="white"
                borderColor="blue.200"
                _focus={{ borderColor: "blue.500", boxShadow: "outline" }}
              >
                {navigationOptions.map((option) => (
                  <option key={option.path} value={option.path}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Box>

            {/* Desktop instruction */}
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color="blue.600"
              display={{ base: "none", lg: "block" }}
              mt={4}
            >
              Select an option from the sidebar
            </Text>
          </Box>

          {/* Main content box */}
          <Box
            bg="white"
            borderRadius="lg"
            p={{ base: 4, md: 6 }}
            boxShadow="sm"
            mb={4}
          >
            <Outlet />
          </Box>
        </Box>
      </Flex>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent bg="blue.950">
          <DrawerCloseButton color="white" />
          <DrawerHeader
            color="white"
            borderBottomWidth="1px"
            borderColor="blue.800"
          >
            Admin Dashboard
          </DrawerHeader>
          <DrawerBody p={4}>
            <Sidebar />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Footer />
    </Flex>
  );
};

export default AdminPage;
