import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import api from "../services/axios-config";
import Cookies from "js-cookie";
import "../index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import APIClient from "../services/api-client";
import { AuthResponse, AuthCredentials } from "../types/forms";
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
  useToast,
  Divider,
  Box,
  Container,
  useColorModeValue,
} from "@chakra-ui/react";

const Login = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/songs" />;

  const { auth, setAuth, logout } = useAuth();
  const toast = useToast();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLParagraphElement | null>(null);

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const authApi = new APIClient<AuthResponse, AuthCredentials>("/api/auth");

  // Color mode values
  const bgColor = useColorModeValue("white", "gray.900");
  const formBgColor = useColorModeValue("gray.50", "gray.800");
  const headerBgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log("Attempting login...");
      const response = await authApi.post({ email: user, password: pwd });
      console.log("Login response:", response);

      const access = response?.accessToken;
      console.log("Access token extracted:", access);
      
      if (access) {
        localStorage.setItem("token", access);
        console.log("Token stored in localStorage:", localStorage.getItem("token"));
        
        setAuth({ user, pwd, access });
        console.log("Auth state updated with:", { user, pwd, access });
        
        setUser("");
        setPwd("");

        navigate("/");
        navigate(0);
      } else {
        console.error("No access token in response");
        setErrMsg("Login failed: No token received");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current?.focus();
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const decoded: any = jwtDecode(credentialResponse.credential);
      console.log("Google response:", {
        credential: credentialResponse.credential,
        decoded,
      });

      try {
        // First try to login
        const response = await api.post("api/auth/google/google-login", {
          token: credentialResponse.credential,
        });

        const access = response?.data?.accessToken;
        localStorage.setItem("token", access);
        setAuth({ user: decoded.email, pwd: "", access });
        navigate("/");
        navigate(0);
      } catch (loginErr: any) {
        // If login fails with 404 (user not found), try registration
        if (loginErr.response?.status === 404) {
          const registerResponse = await api.post(
            "api/auth/google/google-register",
            {
              token: credentialResponse.credential,
            }
          );

          const access = registerResponse?.data?.token;
          console.log("Google registration response:", registerResponse);
          localStorage.setItem("token", access);
          setAuth({ user: decoded.email, pwd: "", access });
          navigate("/");
          navigate(0);
        } else {
          throw loginErr; // Re-throw other errors
        }
      }
    } catch (err: any) {
      console.error("Google auth error:", err);
      setErrMsg(
        err.response?.status === 401
          ? "Google Authentication Failed"
          : "Login Failed"
      );
      errRef.current?.focus();
    }
  };

  // Add debug logging
  const clientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;
  console.log("Google OAuth Client ID:", clientId); // Temporary debug log

  return (
    <GoogleOAuthProvider clientId={clientId || ""}>
      <Box minH="100vh" bg={bgColor} py={8}>
        <Container maxW="md">
          <Stack spacing={8} align="center">
            <Stack spacing={4} align="center" p={8} bg={headerBgColor} borderRadius="xl" boxShadow="xl" w="full" border="1px" borderColor={borderColor}>
              <Image
                src="/songBankLogo.png"
                alt="SongLibrary Logo"
                boxSize="80px"
                objectFit="contain"
              />
              <Heading fontSize="2xl" textAlign="center" color={textColor}>
                Sign in to your account
              </Heading>
            </Stack>
            
            <Box bg={formBgColor} p={8} borderRadius="xl" boxShadow="xl" w="full" border="1px" borderColor={borderColor}>
              {errMsg && (
                <Box
                  bg="red.50"
                  border="1px"
                  borderColor="red.200"
                  borderRadius="md"
                  p={3}
                  color="red.600"
                  fontSize="sm"
                  mb={6}
                >
                  {errMsg}
                </Box>
              )}

              <form onSubmit={handleSubmit}>
                <Stack spacing={6}>
                  <FormControl id="email" isRequired>
                    <FormLabel color={textColor}>Email address</FormLabel>
                    <Input 
                      type="email" 
                      value={user}
                      onChange={(e) => setUser(e.target.value)}
                      ref={userRef}
                      size="lg"
                      bg="white"
                      borderColor={borderColor}
                      _hover={{ borderColor: "blue.300" }}
                      _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
                    />
                  </FormControl>
                  
                  <FormControl id="password" isRequired>
                    <FormLabel color={textColor}>Password</FormLabel>
                    <InputGroup size="lg">
                      <Input 
                        type={showPassword ? "text" : "password"}
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                        bg="white"
                        borderColor={borderColor}
                        _hover={{ borderColor: "blue.300" }}
                        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
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

                  <Stack spacing={6}>
                    <Flex justify="space-between" align="center">
                      <Text color="blue.400">
                        <Link to="/reset-password">Forgot password?</Link>
                      </Text>
                    </Flex>
                    
                    <Button 
                      colorScheme="red" 
                      variant="solid"
                      type="submit"
                      size="lg"
                      w="full"
                    >
                      Sign in
                    </Button>
                  </Stack>
                </Stack>
              </form>

              <Divider my={6} borderColor={borderColor} />

              <Stack spacing={4}>
                <Text textAlign="center" color={textColor}>
                  Or sign in with:
                </Text>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setErrMsg("Google Login Failed")}
                  width="100%"
                />
              </Stack>

              <Text textAlign="center" color={textColor} mt={6}>
                Need an Account?{" "}
                <Link to="/register">
                  <Text as="span" color="blue.400">
                    Sign Up
                  </Text>
                </Link>
              </Text>
            </Box>
          </Stack>
        </Container>
      </Box>
    </GoogleOAuthProvider>
  );
};

export default Login;
