import { Heading, useToast } from "@chakra-ui/react";
import {
  faCheck,
  faInfoCircle,
  faTimes,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  CUSTOMERS_ENDPOINT,
  EMAIL_REGEX,
  NAME_REGEX,
  PWD_REGEX,
  USERS_ENDPOINT,
  PHONE_NUMBER_REGEX,
} from "../data/constants";
import countries from "../data/countries";
import Customer from "../entities/Customer";
import APIClient, { axiosInstance } from "../services/api-client";
import "../index.css";
import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import { UserPayload, UserResponse, CustomerPayload } from "../types/forms";
import { GoogleOAuthProvider } from "@react-oauth/google";
import {
  Button,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Image,
  InputGroup,
  InputRightElement,
  IconButton,
  Divider,
  Box,
  Select,
  Checkbox,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import backgroundImage from "../assets/background_image.jpg";
import { getValidToken } from "../utils/jwt-validator";

const userApiClient = new APIClient<UserResponse, UserPayload>(USERS_ENDPOINT);
const customerApiClient = new APIClient<Customer, CustomerPayload>(
  CUSTOMERS_ENDPOINT
);

const Register = () => {
  const jwt = getValidToken();
  if (jwt) return <Navigate to="/songs" />;

  const navigate = useNavigate();
  const toast = useToast();

  //defining ref hooks
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLParagraphElement | null>(null);

  //defining state hooks
  const [name, setName] = useState("");
  const [validName, setValidName] = useState(false);
  const [nameFocus, setNameFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [country, setCountry] = useState("");
  const [countryFocus, setCountryFocus] = useState(false);

  const [phone, setPhone] = useState("");
  const [phoneFocus, setPhoneFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [loading, setLoading] = useState(false);

  const [errMsg, setErrMsg] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [validPhone, setValidPhone] = useState(false);

  // Add loading state for Google button
  const [googleLoaded, setGoogleLoaded] = useState(false);

  // Add these state variables after other state declarations
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);

  // Verify client ID on component mount
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;
    if (clientId) {
      setGoogleLoaded(true);
      console.log("Google OAuth Client ID loaded:", clientId);
    } else {
      console.error(
        "Google OAuth Client ID not found in environment variables"
      );
    }
  }, []);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  useEffect(() => {
    setValidName(NAME_REGEX.test(name));
  }, [name]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
    setValidMatch(password === matchPassword);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrMsg("");
  }, [name, email, password, matchPassword]);

  useEffect(() => {
    setValidPhone(PHONE_NUMBER_REGEX.test(phone));
  }, [phone]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!acceptedTerms) {
      setTermsError(true);
      return;
    }

    setLoading(true);

    try {
      const userPayload: UserPayload = {
        name: name,
        email: email,
        password: password,
      };

      const response = await userApiClient.post(userPayload);
      const { accessToken } = response;

      // Store the token and redirect
      localStorage.setItem("token", accessToken);

      try {
        await customerApiClient.post({
          user: response.user._id,
          country: country,
        });
      } catch (customerError: any) {
        console.error("Customer profile creation failed:", customerError);
      }

      // Navigate to songs page directly instead of auth
      navigate("/");
      navigate(0); // Refresh to update the user context
    } catch (error) {
      const err = error as AxiosError;
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg("Username Taken");
      } else {
        setErrMsg("Registration Failed");
      }
      errRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const decoded: any = jwtDecode(credentialResponse.credential);
      console.log("Google response:", {
        credential: credentialResponse.credential,
        decoded,
      });

      const response = await axiosInstance.post(
        "/api/auth/google/google-register",
        {
          token: credentialResponse.credential,
        }
      );

      localStorage.setItem("token", response.data.accessToken);
      toast({
        title: "Registration successful",
        description: "Registration successful",
        status: "success",
        duration: 3000,
      });

      navigate("/");
    } catch (err: any) {
      console.error("Google registration error:", err);
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg("Account Already Exists - Please Login Instead");
        setTimeout(() => navigate("/auth"), 2000);
      } else {
        setErrMsg(`Registration Failed: ${err.message}`);
      }
      errRef.current?.focus();
    }
  };

  // Update the isFormValid function
  const isFormValid = () => {
    return (
      validName &&
      validEmail &&
      validPassword &&
      validMatch &&
      country !== "" &&
      acceptedTerms
    );
  };

  return (
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID || ""}
    >
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
              <Heading fontSize={"2xl"} textAlign="center" color="gray.700">Create your account</Heading>
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
                  id="name"
                  isRequired
                  isInvalid={name ? !validName : false}
                >
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    ref={nameRef}
                    onFocus={() => setNameFocus(true)}
                    onBlur={() => setNameFocus(false)}
                    placeholder="Enter full name..."
                  />
                  {nameFocus && name && !validName && (
                    <FormHelperText>
                      <FontAwesomeIcon icon={faInfoCircle} /> 3 to 50
                      characters. Letters, spaces, underscores, hyphens allowed.
                    </FormHelperText>
                  )}
                  {name && !validName && (
                    <FormErrorMessage>
                      <FontAwesomeIcon icon={faTimes} /> Invalid name format
                    </FormErrorMessage>
                  )}
                </FormControl>

                <FormControl
                  id="email"
                  isRequired
                  isInvalid={email ? !validEmail : false}
                >
                  <FormLabel>Email address</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    ref={emailRef}
                    onFocus={() => setEmailFocus(true)}
                    onBlur={() => setEmailFocus(false)}
                    placeholder="Enter email address..."
                  />
                  {emailFocus && email && !validEmail && (
                    <FormHelperText>
                      <FontAwesomeIcon icon={faInfoCircle} /> Must be a valid
                      email address format.
                    </FormHelperText>
                  )}
                  {email && !validEmail && (
                    <FormErrorMessage>
                      <FontAwesomeIcon icon={faTimes} /> Invalid email format
                    </FormErrorMessage>
                  )}
                </FormControl>

                <FormControl id="country" isRequired>
                  <FormLabel>Country</FormLabel>
                  <Select
                    placeholder="Select Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    onFocus={() => setCountryFocus(true)}
                    onBlur={() => setCountryFocus(false)}
                  >
                    {countries.map((country) => (
                      <option value={country.iso} key={country.iso}>
                        {country.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl
                  id="password"
                  isRequired
                  isInvalid={password ? !validPassword : false}
                >
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPasswordFocus(true)}
                      onBlur={() => setPasswordFocus(false)}
                      placeholder="Enter password"
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
                      <FontAwesomeIcon icon={faInfoCircle} /> 8 to 24
                      characters. Must include uppercase and lowercase letters,
                      a number and a special character.
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
                  <FormLabel>Confirm Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={matchPassword}
                      onChange={(e) => setMatchPassword(e.target.value)}
                      placeholder="Confirm password"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
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

                <FormControl isInvalid={termsError}>
                  <Checkbox
                    isChecked={acceptedTerms}
                    onChange={(e) => {
                      setAcceptedTerms(e.target.checked);
                      setTermsError(false);
                    }}
                  >
                    I agree to the{" "}
                    <Link to="/terms" target="_blank">
                      <Text as="span" color="blue.500">
                        Terms and Conditions
                      </Text>
                    </Link>
                  </Checkbox>
                  {termsError && (
                    <FormErrorMessage>
                      You must accept the Terms and Conditions to continue
                    </FormErrorMessage>
                  )}
                </FormControl>

                <Button
                  colorScheme={"red"}
                  variant={"solid"}
                  type="submit"
                  size="lg"
                  isLoading={loading}
                  loadingText="Signing Up..."
                  isDisabled={!isFormValid()}
                >
                  Create Account
                </Button>
              </Stack>
            </form>

            <Divider />

            <Stack spacing={4}>
              <Text textAlign="center" color="gray.600">
                Or create account with:
              </Text>
              {googleLoaded && (
                <GoogleLogin
                  text="signup_with"
                  shape="rectangular"
                  theme="outline"
                  size="large"
                  width="100%"
                  onSuccess={handleGoogleSuccess}
                  onError={() => setErrMsg("Google Sign Up Failed")}
                />
              )}
            </Stack>

            <Text textAlign="center" color="gray.600">
              Already have an account?{" "}
              <Link to="/auth">
                <Text as="span" color="blue.500">
                  Sign In
                </Text>
              </Link>
            </Text>
          </Stack>
        </Flex>

        <Flex flex={1} display={{ base: "none", md: "flex" }}>
          <Image
            alt={"Registration Image"}
            objectFit={"cover"}
            src={backgroundImage}
          />
        </Flex>
      </Stack>
    </GoogleOAuthProvider>
  );
};

export default Register;
