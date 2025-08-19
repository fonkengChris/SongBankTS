import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  useToast,
  Spinner,
  Badge,
  Icon,
  useColorModeValue,
  useColorMode,
  Divider,
  Stack,
  Image,
  FormErrorMessage,
  FormHelperText,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardBody,
  CardHeader,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTimes,
  faInfoCircle,
  faEye,
  faEyeSlash,
  faUser,
  faKey,
  faCog,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FaEdit, FaUser as FaUserIcon, FaKey as FaKeyIcon, FaCog as FaCogIcon, FaShieldAlt as FaShieldAltIcon } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CHANGE_PASSWORD_ENDPOINT, PWD_REGEX } from "../data/constants";
import { axiosInstance } from "../services/api-client";
import useAuth from "../hooks/useAuth";
import useCustomer from "../hooks/useCustomer";
import CountrySelector from "../components/CountrySelector";
import ColorModeSwitch from "../components/ColorModeSwitch";
import APIClient from "../services/api-client";
import { CUSTOMERS_ENDPOINT } from "../data/constants";
import Customer from "../entities/Customer";
import { CustomerUpdateFormData } from "../types/forms";

const customerApiClient = new APIClient<Customer, CustomerUpdateFormData>(
  CUSTOMERS_ENDPOINT
);

const Settings = () => {
  const { isAuthenticated, auth } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState(0);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Color mode hook and values
  const { colorMode, setColorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const formBgColor = useColorModeValue("white", "gray.800");
  const headerBgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const cardBgColor = useColorModeValue("white", "gray.800");

  // Responsive values
  const containerMaxW = useBreakpointValue({ base: "100%", md: "4xl" });
  const headerPadding = useBreakpointValue({ base: 4, md: 8 });
  const tabPanelPadding = useBreakpointValue({ base: 4, md: 8 });
  const logoSize = useBreakpointValue({ base: "120px", md: "160px" });
  const headingSize = useBreakpointValue({ base: "2xl", md: "3xl" });
  const buttonSize = useBreakpointValue({ base: "md", md: "lg" });
  const inputSize = useBreakpointValue({ base: "md", md: "lg" });
  const spacing = useBreakpointValue({ base: 4, md: 8 });
  const stackSpacing = useBreakpointValue({ base: 4, md: 6 });
  const formSpacing = useBreakpointValue({ base: 4, md: 6 });

  // Authentication check
  if (!isAuthenticated) {
    return (
      <Box minH="100vh" bg={bgColor} py={spacing}>
        <Container maxW="md" px={4}>
          <Stack spacing={spacing} align="center">
            <Stack spacing={4} align="center" p={headerPadding} bg={headerBgColor} borderRadius="xl" boxShadow="xl" w="full" border="1px" borderColor={borderColor}>
              <Image
                src="/songBankLogo.png"
                alt="SongLibrary Logo"
                boxSize={logoSize}
                objectFit="contain"
              />
              <Heading color={textColor} size="lg">Authentication Required</Heading>
            </Stack>
            <Box bg={formBgColor} p={headerPadding} borderRadius="xl" boxShadow="xl" w="full" textAlign="center" border="1px" borderColor={borderColor}>
              <Text mb={6} color={textColor}>Please log in to access your settings.</Text>
              <Button as="a" href="/auth" colorScheme="blue" size={buttonSize} w="full">
                Go to Login
              </Button>
            </Box>
          </Stack>
        </Container>
      </Box>
    );
  }

  // Get user info from token
  let user: any = null;
  try {
    if (auth.access) {
      user = JSON.parse(atob(auth.access.split('.')[1]));
    }
  } catch (error) {
    console.error("Error decoding token:", error);
  }

  if (!user) {
    return (
      <Box minH="100vh" bg={bgColor} py={spacing}>
        <Container maxW="md" px={4}>
          <Stack spacing={spacing} align="center">
            <Stack spacing={4} align="center" p={headerPadding} bg={headerBgColor} borderRadius="xl" boxShadow="xl" w="full" border="1px" borderColor={borderColor}>
              <Image
                src="/songBankLogo.png"
                alt="SongLibrary Logo"
                boxSize={logoSize}
                objectFit="contain"
              />
              <Heading color={textColor} size="lg">Invalid Token</Heading>
            </Stack>
            <Box bg={formBgColor} p={headerPadding} borderRadius="xl" boxShadow="xl" w="full" textAlign="center" border="1px" borderColor={borderColor}>
              <Text mb={6} color={textColor}>Please log in again.</Text>
              <Button as="a" href="/auth" colorScheme="blue" size={buttonSize} w="full">
                Go to Login
              </Button>
            </Box>
          </Stack>
        </Container>
      </Box>
    );
  }

  // Fetch customer data
  const { data: customer, error, isLoading } = useCustomer(user._id);

  // Profile form state
  const [country, setCountry] = useState("");

  // Password form state
  const [oldPassword, setOldPassword] = useState("");
  const [validOldPassword, setValidOldPassword] = useState(false);
  const [oldPasswordFocus, setOldPasswordFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");

  // Password visibility toggles
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Note: Removed forced dark mode override to allow user preference

  // Update country when customer data loads
  useEffect(() => {
    if (customer) {
      setCountry(customer.country || "");
    }
  }, [customer]);

  // Password validation effects
  useEffect(() => {
    setValidOldPassword(PWD_REGEX.test(oldPassword));
  }, [oldPassword]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
    setValidMatch(password === matchPassword);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrMsg("");
  }, [password, matchPassword]);

  // Profile update handler
  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdatingProfile(true);

    try {
      if (!customer?._id) return;

      await customerApiClient.put(customer._id, {
        country: country || customer.country,
      });

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      navigate(`/users/${customer._id}`);
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.response?.data || "Failed to update profile.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Password change handler
  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdatingPassword(true);

    try {
      const endpoint = CHANGE_PASSWORD_ENDPOINT + "/" + user._id;
      const response = await axiosInstance.post(endpoint, {
        old_password: oldPassword,
        password: password,
      });

      toast({
        title: "Password Changed Successfully",
        description: "Your password has been updated. You will be logged out and redirected to the login page.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      // Clear localStorage (logout)
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Password Change Failed",
        description: error.response?.data || "An error occurred while changing your password.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Account deletion handler
  const handleDeleteAccount = async () => {
    try {
      // Call the delete user API endpoint
      await axiosInstance.delete(`/api/users/${user._id}`);

      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted. You will be redirected to the home page.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      // Clear localStorage (logout)
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to home page after a short delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Account Deletion Failed",
        description: error.response?.data || "An error occurred while deleting your account. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  if (isLoading) {
    return (
      <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="blue.500" />
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor} py={spacing}>
      <Container maxW={containerMaxW} px={4}>
        <VStack spacing={spacing} align="stretch">
          {/* Header */}
          <Stack spacing={4} align="center" p={headerPadding} bg={headerBgColor} borderRadius="xl" boxShadow="xl" border="1px" borderColor={borderColor}>
            <Image
              src="/songBankLogo.png"
              alt="SongLibrary Logo"
              boxSize={logoSize}
              objectFit="contain"
            />
            <Heading fontSize={headingSize} color={textColor}>Settings</Heading>
            <Text color={textColor} textAlign="center" px={2}>
              Manage your account settings and preferences
            </Text>
          </Stack>

          {/* Main Settings Content */}
          <Box bg={cardBgColor} borderRadius="xl" boxShadow="xl" border="1px" borderColor={borderColor} overflow="hidden">
            <Tabs index={activeTab} onChange={setActiveTab} variant="enclosed" colorScheme="blue">
              {/* Scroll hint for mobile */}
              <Box 
                display={{ base: "block", md: "none" }} 
                textAlign="center" 
                py={2} 
                px={4} 
                bg={useColorModeValue("blue.50", "blue.900")} 
                color={useColorModeValue("blue.600", "blue.200")}
                fontSize="xs"
                borderBottom="1px"
                borderColor={borderColor}
              >
                ← Scroll to see all tabs →
              </Box>
              <Box overflowX="auto" css={{
                '&::-webkit-scrollbar': {
                  height: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: useColorModeValue('gray.300', 'gray.600'),
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: useColorModeValue('gray.400', 'gray.500'),
                },
              }}>
                <TabList bg={formBgColor} px={{ base: 2, md: 6 }} pt={6} minW="max-content">
                  <Tab 
                    color={useColorModeValue("gray.800", "gray.200")} 
                    minW={{ base: "100px", sm: "120px", md: "140px" }} 
                    fontSize={{ base: "xs", sm: "sm", md: "md" }}
                    px={{ base: 1, sm: 2, md: 4 }}
                    py={{ base: 2, md: 3 }}
                    whiteSpace="nowrap"
                  >
                    <Icon as={FaUserIcon} mr={{ base: 1, sm: 1, md: 2 }} />
                    Profile
                  </Tab>
                  <Tab 
                    color={useColorModeValue("gray.800", "gray.200")} 
                    minW={{ base: "100px", sm: "120px", md: "140px" }} 
                    fontSize={{ base: "xs", sm: "sm", md: "md" }}
                    px={{ base: 1, sm: 2, md: 4 }}
                    py={{ base: 2, md: 3 }}
                    whiteSpace="nowrap"
                  >
                    <Icon as={FaKeyIcon} mr={{ base: 1, sm: 1, md: 2 }} />
                    Password
                  </Tab>
                  <Tab 
                    color={useColorModeValue("gray.800", "gray.200")} 
                    minW={{ base: "100px", sm: "120px", md: "140px" }} 
                    fontSize={{ base: "xs", sm: "sm", md: "md" }}
                    px={{ base: 1, sm: 2, md: 4 }}
                    py={{ base: 2, md: 3 }}
                    whiteSpace="nowrap"
                  >
                    <Icon as={FaCogIcon} mr={{ base: 1, sm: 1, md: 2 }} />
                    Preferences
                  </Tab>
                  <Tab 
                    color={useColorModeValue("gray.800", "gray.200")} 
                    minW={{ base: "100px", sm: "120px", md: "140px" }} 
                    fontSize={{ base: "xs", sm: "sm", md: "md" }}
                    px={{ base: 1, sm: 2, md: 4 }}
                    py={{ base: 2, md: 3 }}
                    whiteSpace="nowrap"
                  >
                    <Icon as={FaShieldAltIcon} mr={{ base: 1, sm: 1, md: 2 }} />
                    Security
                  </Tab>
                </TabList>
              </Box>

              <TabPanels>
                {/* Profile Tab */}
                <TabPanel p={tabPanelPadding}>
                  <VStack spacing={stackSpacing} align="stretch">
                    <Box>
                      <Heading size="md" color={textColor} mb={2}>Profile Information</Heading>
                      <Text color={textColor} fontSize="sm">Update your personal information and contact details</Text>
                    </Box>

                    <form onSubmit={handleProfileSubmit}>
                      <VStack spacing={formSpacing}>
                        <FormControl>
                          <FormLabel fontWeight="bold" color={textColor}>
                            Full Name
                          </FormLabel>
                          <Input
                            value={user.name || ""}
                            isReadOnly
                            bg={useColorModeValue("gray.100", "gray.700")}
                            borderColor={borderColor}
                            color={textColor}
                            size={inputSize}
                          />
                          <FormHelperText color={useColorModeValue("gray.600", "gray.400")}>
                            Name changes must be made by an administrator
                          </FormHelperText>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontWeight="bold" color={textColor}>
                            Email Address
                          </FormLabel>
                          <Input
                            value={user.email || ""}
                            isReadOnly
                            bg={useColorModeValue("gray.100", "gray.700")}
                            borderColor={borderColor}
                            color={textColor}
                            size={inputSize}
                          />
                          <FormHelperText color={useColorModeValue("gray.600", "gray.400")}>
                            Email changes must be made by an administrator
                          </FormHelperText>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontWeight="bold" color={textColor}>
                            Role
                          </FormLabel>
                          <Input
                            value={user.role?.replace('_', ' ') || ""}
                            isReadOnly
                            bg={useColorModeValue("gray.100", "gray.700")}
                            borderColor={borderColor}
                            textTransform="capitalize"
                            color={textColor}
                            size={inputSize}
                          />
                          <FormHelperText color={useColorModeValue("gray.600", "gray.400")}>
                            Role changes must be made by an administrator
                          </FormHelperText>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontWeight="bold" color={textColor}>
                            Country
                          </FormLabel>
                          <Box
                            bg={useColorModeValue("white", "gray.700")}
                            borderRadius="md"
                            borderWidth="1px"
                            borderColor={borderColor}
                            _hover={{ borderColor: "blue.300" }}
                          >
                            <CountrySelector
                              selectedCountry={country}
                              onSelect={(countryCode) => setCountry(countryCode)}
                            />
                          </Box>
                        </FormControl>

                        <VStack spacing={4} width="100%" pt={4}>
                          <Button
                            onClick={() => navigate(`/users/${user._id}`)}
                            variant="outline"
                            color={textColor}
                            _hover={{ bg: "gray.100" }}
                            w="full"
                            size={buttonSize}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            bg="blue.600"
                            color="white"
                            _hover={{ bg: "blue.700" }}
                            w="full"
                            size={buttonSize}
                            isLoading={isUpdatingProfile}
                            loadingText="Updating..."
                          >
                            Update Profile
                          </Button>
                        </VStack>
                      </VStack>
                    </form>
                  </VStack>
                </TabPanel>

                {/* Password Tab */}
                <TabPanel p={tabPanelPadding}>
                  <VStack spacing={stackSpacing} align="stretch">
                    <Box>
                      <Heading size="md" color={textColor} mb={2}>Change Password</Heading>
                      <Text color={textColor} fontSize="sm">Update your password to keep your account secure</Text>
                    </Box>

                    {errMsg && (
                      <Alert status="error" borderRadius="md">
                        <AlertIcon />
                        <AlertTitle>Error!</AlertTitle>
                        <AlertDescription>{errMsg}</AlertDescription>
                      </Alert>
                    )}

                    <form onSubmit={handlePasswordSubmit}>
                      <VStack spacing={formSpacing}>
                        <FormControl
                          isRequired
                          isInvalid={oldPassword ? !validOldPassword : false}
                        >
                          <FormLabel color={textColor}>Current Password</FormLabel>
                          <InputGroup size={inputSize}>
                            <Input
                              type={showOldPassword ? "text" : "password"}
                              value={oldPassword}
                              onChange={(e) => setOldPassword(e.target.value)}
                              placeholder="Enter current password"
                              onFocus={() => setOldPasswordFocus(true)}
                              onBlur={() => setOldPasswordFocus(false)}
                              bg={useColorModeValue("white", "gray.700")}
                              borderColor={borderColor}
                              _hover={{ borderColor: "blue.300" }}
                              _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
                              color={textColor}
                            />
                            <InputRightElement>
                              <IconButton
                                aria-label={showOldPassword ? "Hide password" : "Show password"}
                                icon={<FontAwesomeIcon icon={showOldPassword ? faEyeSlash : faEye} />}
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowOldPassword(!showOldPassword)}
                              />
                            </InputRightElement>
                          </InputGroup>
                          {oldPasswordFocus && oldPassword && !validOldPassword && (
                            <FormHelperText>
                              <FontAwesomeIcon icon={faInfoCircle} /> 8 to 24 characters.
                              Must include uppercase and lowercase letters, a number and a special character.
                            </FormHelperText>
                          )}
                          {oldPassword && !validOldPassword && (
                            <FormErrorMessage>
                              <FontAwesomeIcon icon={faTimes} /> Invalid password format
                            </FormErrorMessage>
                          )}
                        </FormControl>

                        <FormControl
                          isRequired
                          isInvalid={password ? !validPassword : false}
                        >
                          <FormLabel color={textColor}>New Password</FormLabel>
                          <InputGroup size={inputSize}>
                            <Input
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Enter new password"
                              onFocus={() => setPasswordFocus(true)}
                              onBlur={() => setPasswordFocus(false)}
                              bg={useColorModeValue("white", "gray.700")}
                              borderColor={borderColor}
                              _hover={{ borderColor: "blue.300" }}
                              _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
                              color={textColor}
                            />
                            <InputRightElement>
                              <IconButton
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                icon={<FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />}
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowPassword(!showPassword)}
                              />
                            </InputRightElement>
                          </InputGroup>
                          {passwordFocus && password && !validPassword && (
                            <FormHelperText>
                              <FontAwesomeIcon icon={faInfoCircle} /> 8 to 24 characters.
                              Must include uppercase and lowercase letters, a number and a special character.
                            </FormHelperText>
                          )}
                          {password && !validPassword && (
                            <FormErrorMessage>
                              <FontAwesomeIcon icon={faTimes} /> Password doesn't meet requirements
                            </FormErrorMessage>
                          )}
                        </FormControl>

                        <FormControl
                          isRequired
                          isInvalid={matchPassword ? !validMatch : false}
                        >
                          <FormLabel color={textColor}>Confirm New Password</FormLabel>
                          <InputGroup size={inputSize}>
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              value={matchPassword}
                              onChange={(e) => setMatchPassword(e.target.value)}
                              placeholder="Confirm new password"
                              onFocus={() => setMatchFocus(true)}
                              onBlur={() => setMatchFocus(false)}
                              bg={useColorModeValue("white", "gray.700")}
                              borderColor={borderColor}
                              _hover={{ borderColor: "blue.300" }}
                              _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
                              color={textColor}
                            />
                            <InputRightElement>
                              <IconButton
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                icon={<FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />}
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              />
                            </InputRightElement>
                          </InputGroup>
                          {matchPassword && !validMatch && (
                            <FormErrorMessage>
                              <FontAwesomeIcon icon={faTimes} /> Passwords don't match
                            </FormErrorMessage>
                          )}
                        </FormControl>

                        <Alert status="info" borderRadius="md">
                          <AlertIcon />
                          <Box>
                            <AlertTitle>Password Requirements</AlertTitle>
                            <AlertDescription>
                              <VStack align="start" spacing={1} mt={2}>
                                <Text fontSize="sm">• At least 8 characters long</Text>
                                <Text fontSize="sm">• Include uppercase and lowercase letters</Text>
                                <Text fontSize="sm">• Include at least one number</Text>
                                <Text fontSize="sm">• Include at least one special character</Text>
                              </VStack>
                            </AlertDescription>
                          </Box>
                        </Alert>

                        <VStack spacing={4} width="100%" pt={4}>
                          <Button
                            onClick={() => navigate(`/users/${user._id}`)}
                            variant="outline"
                            color={textColor}
                            w="full"
                            size={buttonSize}
                          >
                            Cancel
                          </Button>
                          <Button
                            colorScheme="red"
                            variant="solid"
                            type="submit"
                            w="full"
                            size={buttonSize}
                            isLoading={isUpdatingPassword}
                            loadingText="Changing Password..."
                          >
                            Change Password
                          </Button>
                        </VStack>
                      </VStack>
                    </form>
                  </VStack>
                </TabPanel>

                {/* Preferences Tab */}
                <TabPanel p={tabPanelPadding}>
                  <VStack spacing={stackSpacing} align="stretch">
                    <Box>
                      <Heading size="md" color={textColor} mb={2}>Preferences</Heading>
                      <Text color={textColor} fontSize="sm">Customize your application experience</Text>
                    </Box>

                    <Card>
                      <CardHeader>
                        <Heading size="sm" color={textColor}>Notification Settings</Heading>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={4} align="stretch">
                          <Box>
                            <Text fontSize="sm" fontWeight="medium" color={textColor} mb={2}>
                              Email Notifications
                            </Text>
                            <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")} mb={3}>
                              Receive notifications about important updates
                            </Text>
                            <Badge colorScheme="green" variant="subtle">Enabled</Badge>
                          </Box>

                          <Box>
                            <Text fontSize="sm" fontWeight="medium" color={textColor} mb={2}>
                              SMS Notifications
                            </Text>
                            <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")} mb={3}>
                              Receive urgent notifications via SMS
                            </Text>
                            <Badge colorScheme="gray" variant="subtle">Disabled</Badge>
                          </Box>
                        </VStack>
                      </CardBody>
                    </Card>

                    <Card>
                      <CardHeader>
                        <Heading size="sm" color={textColor}>Display Settings</Heading>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={4} align="stretch">
                          <FormControl>
                            <FormLabel fontSize="sm" fontWeight="medium" color={textColor}>
                              Theme
                            </FormLabel>
                            <Box
                              bg={useColorModeValue("white", "gray.700")}
                              p={4}
                              borderRadius="md"
                              borderWidth="1px"
                              borderColor={borderColor}
                            >
                              <ColorModeSwitch />
                            </Box>
                            <FormHelperText color={useColorModeValue("gray.600", "gray.400")}>
                              Toggle between light and dark themes. Dark mode is the default.
                            </FormHelperText>
                          </FormControl>
                        </VStack>
                      </CardBody>
                    </Card>
                  </VStack>
                </TabPanel>

                {/* Security Tab */}
                <TabPanel p={tabPanelPadding}>
                  <VStack spacing={stackSpacing} align="stretch">
                    <Box>
                      <Heading size="md" color={textColor} mb={2}>Security Settings</Heading>
                      <Text color={textColor} fontSize="sm">Manage your account security and privacy</Text>
                    </Box>

                    <Alert status="warning" borderRadius="md">
                      <AlertIcon />
                      <Box>
                        <AlertTitle>Security Information</AlertTitle>
                        <AlertDescription>
                          Your account is protected with industry-standard security measures.
                        </AlertDescription>
                      </Box>
                    </Alert>

                    <Card>
                      <CardHeader>
                        <Heading size="sm" color={textColor}>Current Login Session</Heading>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={4} align="stretch">
                          <Box p={4} bg={useColorModeValue("gray.50", "gray.700")} borderRadius="lg">
                            <VStack spacing={3} align="stretch">
                              <HStack justify="space-between">
                                <Text fontSize="sm" fontWeight="medium" color={textColor}>
                                  Session Started
                                </Text>
                                <Badge colorScheme="green" variant="subtle">Active</Badge>
                              </HStack>
                              <Text fontSize="sm" color={useColorModeValue("gray.500", "gray.300")}>
                                {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                              </Text>
                              <Text fontSize="xs" color={useColorModeValue("gray.400", "gray.400")}>
                                Your session will remain active until you log out or the token expires
                              </Text>
                            </VStack>
                          </Box>

                          <Box p={4} bg={useColorModeValue("gray.50", "gray.700")} borderRadius="lg">
                            <VStack spacing={3} align="stretch">
                              <HStack justify="space-between">
                                <Text fontSize="sm" fontWeight="medium" color={textColor}>
                                  Device Information
                                </Text>
                              </HStack>
                              <Text fontSize="sm" color={useColorModeValue("gray.500", "gray.300")}>
                                Browser: {navigator.userAgent.split(') ').pop()?.split(' ')[0] || 'Unknown'}
                              </Text>
                              <Text fontSize="sm" color={useColorModeValue("gray.500", "gray.300")}>
                                Platform: {navigator.platform || 'Unknown'}
                              </Text>
                            </VStack>
                          </Box>
                        </VStack>
                      </CardBody>
                    </Card>

                    <Card>
                      <CardHeader>
                        <Heading size="sm" color={textColor}>Account Management</Heading>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={4} align="stretch">
                          <Alert status="warning" borderRadius="md">
                            <AlertIcon />
                            <Box>
                              <AlertTitle>Danger Zone</AlertTitle>
                              <AlertDescription>
                                Deleting your account is permanent and cannot be undone. All your data, including liked songs, comments, and profile information will be permanently removed.
                              </AlertDescription>
                            </Box>
                          </Alert>
                          
                          <Button
                            colorScheme="red"
                            variant="outline"
                            size={buttonSize}
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                                handleDeleteAccount();
                              }
                            }}
                            _hover={{ bg: "red.50", borderColor: "red.400" }}
                            w="full"
                          >
                            Delete Account
                          </Button>
                        </VStack>
                      </CardBody>
                    </Card>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Settings;
