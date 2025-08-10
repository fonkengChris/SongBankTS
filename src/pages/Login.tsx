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
} from "@chakra-ui/react";
import backgroundImage from "../assets/background_image.jpg";
import { getValidToken } from "../utils/jwt-validator";

const Login = () => {
  const jwt = getValidToken();
  if (jwt) return <Navigate to="/songs" />;

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

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log("Attempting login...");
      const response = await authApi.post({ email: user, password: pwd });
      // console.log("Login successful:", response);

      const access = response?.accessToken;
      localStorage.setItem("token", access);

      setAuth({ user, pwd, access });
      console.log(auth);
      setUser("");
      setPwd("");

      navigate("/");
      navigate(0);
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
      <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
        <Flex p={8} flex={1} align={'center'} justify={'center'}>
          <Stack spacing={6} w={'full'} maxW={'md'}>
            <Heading fontSize={'2xl'}>Sign in to your account</Heading>
            
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
                <FormControl id="email" isRequired>
                  <FormLabel>Email address</FormLabel>
                  <Input 
                    type="email" 
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    ref={userRef}
                  />
                </FormControl>
                
                <FormControl id="password" isRequired>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input 
                      type={showPassword ? "text" : "password"}
                      value={pwd}
                      onChange={(e) => setPwd(e.target.value)}
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
                    <Text color={'blue.500'}>
                      <Link to="/reset-password">Forgot password?</Link>
                    </Text>
                  </Flex>
                  
                  <Button 
                    colorScheme={'red'} 
                    variant={'solid'}
                    type="submit"
                    size="lg"
                  >
                    Sign in
                  </Button>
                </Stack>
              </Stack>
            </form>

            <Divider />

            <Stack spacing={4}>
              <Text textAlign="center" color="gray.600">
                Or sign in with:
              </Text>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setErrMsg("Google Login Failed")}
                width="100%"
              />
            </Stack>

            <Text textAlign="center" color="gray.600">
              Need an Account?{" "}
              <Link to="/register">
                <Text as="span" color="blue.500">
                  Sign Up
                </Text>
              </Link>
            </Text>
          </Stack>
        </Flex>
        
        <Flex flex={1} display={{ base: 'none', md: 'flex' }}>
          <Image
            alt={'Login Image'}
            objectFit={'cover'}
            src={backgroundImage}
          />
        </Flex>
      </Stack>
    </GoogleOAuthProvider>
  );
};

export default Login;
