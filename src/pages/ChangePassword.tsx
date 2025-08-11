import {
  faCheck,
  faTimes,
  faInfoCircle,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { CHANGE_PASSWORD_ENDPOINT, PWD_REGEX } from "../data/constants";
import { axiosInstance } from "../services/api-client";
import { useNavigate } from "react-router-dom";
import CurrentUser from "../entities/CurrentUser";
import {
  Box,
  Container,
  Flex,
  FormControl,
  FormLabel,
  useToast,
  Button,
  Text,
  Heading,
  Input,
  Stack,
  Image,
  InputGroup,
  InputRightElement,
  IconButton,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import backgroundImage from "../assets/background_image.jpg";
import useAuth from "../hooks/useAuth";

const ChangePassword = () => {
  const { isAuthenticated, auth } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  
  if (!isAuthenticated) {
    return (
      <Container maxW="container.md" py={8}>
        <Flex direction="column" align="center" justify="center" minH="50vh">
          <Stack spacing={4} align="center" mb={6} p={6} bg="gray.50" borderRadius="lg" border="1px" borderColor="gray.200">
            <Image
              src="/songBankLogo.png"
              alt="SongLibrary Logo"
              boxSize="80px"
              objectFit="contain"
            />
            <Heading mb={4} color="gray.700">Authentication Required</Heading>
          </Stack>
          <Text mb={6}>Please log in to change your password.</Text>
          <Button as="a" href="/auth" colorScheme="blue">
            Go to Login
          </Button>
        </Flex>
      </Container>
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
      <Container maxW="container.md" py={8}>
        <Flex direction="column" align="center" justify="center" minH="50vh">
          <Stack spacing={4} align="center" mb={6} p={6} bg="gray.50" borderRadius="lg" border="1px" borderColor="gray.200">
            <Image
              src="/songBankLogo.png"
              alt="SongLibrary Logo"
              boxSize="80px"
              objectFit="contain"
            />
            <Heading mb={4} color="gray.700">Invalid Token</Heading>
          </Stack>
          <Text mb={6}>Please log in again.</Text>
          <Button as="a" href="/auth" colorScheme="blue">
            Go to Login
          </Button>
        </Flex>
      </Container>
    );
  }

  const endpoint = CHANGE_PASSWORD_ENDPOINT + "/" + user._id;

  const [old_password, setOldPassword] = useState("");
  const [validOldPassword, setValidOldPassword] = useState(false);
  const [oldPasswordFocus, setOldPasswordFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setValidOldPassword(PWD_REGEX.test(old_password));
  }, [password]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
    setValidMatch(password === matchPassword);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrMsg("");
  }, [password, matchPassword]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(endpoint, {
        old_password,
        password,
      });
      console.log(response);

      // Show success toast
      toast({
        title: "Password Changed Successfully",
        description:
          "Your password has been updated. You will be logged out and redirected to the login page.",
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
      // Show error toast
      toast({
        title: "Password Change Failed",
        description:
          error.response?.data ||
          "An error occurred while changing your password.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
      <Flex p={8} flex={1} align={"center"} justify={"center"}>
        <Stack spacing={6} w={"full"} maxW={"md"}>
          <Stack spacing={4} align="center" mb={4} p={6} bg="gray.50" borderRadius="lg" border="1px" borderColor="gray.200">
            <Image
              src="/songBankLogo.png"
              alt="SongLibrary Logo"
              boxSize="80px"
              objectFit="contain"
            />
            <Heading fontSize={"2xl"} textAlign="center" color="gray.700">Change your password</Heading>
          </Stack>

          {errMsg && (
            <Box
              bg="red.50"
              border="1px"
              borderColor="red.200"
              borderRadius="md"
              p={3}
              color="red.600"
              fontSize="sm"
            >
              {errMsg}
            </Box>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl
                id="oldPassword"
                isRequired
                isInvalid={old_password ? !validOldPassword : false}
              >
                <FormLabel>Current Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showOldPassword ? "text" : "password"}
                    value={old_password}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    onFocus={() => setOldPasswordFocus(true)}
                    onBlur={() => setOldPasswordFocus(false)}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={
                        showOldPassword ? "Hide password" : "Show password"
                      }
                      icon={
                        <FontAwesomeIcon
                          icon={showOldPassword ? faEyeSlash : faEye}
                        />
                      }
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    />
                  </InputRightElement>
                </InputGroup>
                {oldPasswordFocus && old_password && !validOldPassword && (
                  <FormHelperText>
                    <FontAwesomeIcon icon={faInfoCircle} /> 8 to 24 characters.
                    Must include uppercase and lowercase letters, a number and a
                    special character.
                  </FormHelperText>
                )}
                {old_password && !validOldPassword && (
                  <FormErrorMessage>
                    <FontAwesomeIcon icon={faTimes} /> Invalid password format
                  </FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                id="newPassword"
                isRequired
                isInvalid={password ? !validPassword : false}
              >
                <FormLabel>New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    onFocus={() => setPasswordFocus(true)}
                    onBlur={() => setPasswordFocus(false)}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      icon={
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                        />
                      }
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </InputRightElement>
                </InputGroup>
                {passwordFocus && password && !validPassword && (
                  <FormHelperText>
                    <FontAwesomeIcon icon={faInfoCircle} /> 8 to 24 characters.
                    Must include uppercase and lowercase letters, a number and a
                    special character.
                  </FormHelperText>
                )}
                {password && !validPassword && (
                  <FormErrorMessage>
                    <FontAwesomeIcon icon={faTimes} /> Password doesn't meet
                    requirements
                  </FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                id="confirmPassword"
                isRequired
                isInvalid={matchPassword ? !validMatch : false}
              >
                <FormLabel>Confirm New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={matchPassword}
                    onChange={(e) => setMatchPassword(e.target.value)}
                    placeholder="Confirm new password"
                    onFocus={() => setMatchFocus(true)}
                    onBlur={() => setMatchFocus(false)}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                      icon={
                        <FontAwesomeIcon
                          icon={showConfirmPassword ? faEyeSlash : faEye}
                        />
                      }
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    />
                  </InputRightElement>
                </InputGroup>
                {matchPassword && !validMatch && (
                  <FormErrorMessage>
                    <FontAwesomeIcon icon={faTimes} /> Passwords don't match
                  </FormErrorMessage>
                )}
              </FormControl>

              <Stack direction="row" spacing={4}>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/users/${user._id}`)}
                  flex={1}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  variant="solid"
                  type="submit"
                  flex={1}
                >
                  Change Password
                </Button>
              </Stack>
            </Stack>
          </form>
        </Stack>
      </Flex>

      <Flex flex={1} display={{ base: "none", md: "flex" }}>
        <Image
          alt={"Change Password Image"}
          objectFit={"cover"}
          src={backgroundImage}
        />
      </Flex>
    </Stack>
  );
};

export default ChangePassword;
