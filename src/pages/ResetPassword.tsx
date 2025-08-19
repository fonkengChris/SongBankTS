import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../services/api-client";
import {
  REQUEST_RESET_ENDPOINT,
  RESET_PASSWORD_ENDPOINT,
} from "../data/constants";
import {
  Button,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Image,
  InputGroup,
  InputRightElement,
  IconButton,
  Box,
  useToast,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post(REQUEST_RESET_ENDPOINT, { email });
      setMessage(
        "If an account exists with this email, you will receive password reset instructions."
      );
      setError("");
      toast({
        title: "Reset Request Sent",
        description: "Check your email for password reset instructions.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      setError("Failed to send reset instructions. Please try again.");
      setMessage("");
      toast({
        title: "Request Failed",
        description: "Failed to send reset instructions. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await axiosInstance.post(RESET_PASSWORD_ENDPOINT, {
        token,
        password,
      });
      localStorage.removeItem("token");
      localStorage.removeItem("tokenRef");

      setMessage("Password successfully reset. You can now login.");
      toast({
        title: "Password Reset Successful",
        description: "Your password has been reset. Redirecting to login...",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setTimeout(() => navigate("/auth"), 3000);
    } catch (err) {
      setError("Failed to reset password. The link may be invalid or expired.");
      toast({
        title: "Reset Failed",
        description: "Failed to reset password. The link may be invalid or expired.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Show request form if no token, otherwise show reset form
  return (
    <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} align={'center'} justify={'center'}>
        <Stack spacing={6} w={'full'} maxW={'md'}>
          <Heading fontSize={'2xl'}>
            {token ? "Reset Password" : "Request Password Reset"}
          </Heading>
          
          {message && (
            <Box
              bg="green.50"
              border="1px"
              borderColor="green.200"
              borderRadius="md"
              p={3}
              color="green.600"
              fontSize="sm"
            >
              {message}
            </Box>
          )}
          
          {error && (
            <Box
              bg="red.50"
              border="1px"
              borderColor="red.200"
              borderRadius="md"
              p={3}
              color="red.600"
              fontSize="sm"
            >
              {error}
            </Box>
          )}

          {!token ? (
            <form onSubmit={handleRequestReset}>
              <Stack spacing={4}>
                <FormControl id="email" isRequired>
                  <FormLabel>Email address</FormLabel>
                  <Input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                  />
                </FormControl>

                <Button 
                  colorScheme={'red'} 
                  variant={'solid'}
                  type="submit"
                  size="lg"
                >
                  Request Reset
                </Button>
              </Stack>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <Stack spacing={4}>
                <FormControl id="password" isRequired>
                  <FormLabel>New Password</FormLabel>
                  <InputGroup>
                    <Input 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
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
                </FormControl>

                <FormControl id="confirmPassword" isRequired>
                  <FormLabel>Confirm New Password</FormLabel>
                  <InputGroup>
                    <Input 
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
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
                </FormControl>

                <Button 
                  colorScheme={'red'} 
                  variant={'solid'}
                  type="submit"
                  size="lg"
                >
                  Reset Password
                </Button>
              </Stack>
            </form>
          )}
        </Stack>
      </Flex>
      

    </Stack>
  );
};

export default ResetPassword;
