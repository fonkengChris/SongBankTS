import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Icon,
  Circle,
  Input,
  Button,
  FormControl,
  FormLabel,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { FaRunning, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import APIClient from "../services/api-client";
import { CONTACT_ENDPOINT } from "../data/constants";
import jwtDecode from "jwt-decode";
import CurrentUser from "../entities/CurrentUser";
import { getValidToken, decodeToken } from "../utils/jwt-validator";

interface ContactForm {
  email: string;
  name: string;
  message: string;
}

const contactService = new APIClient<ContactForm>(CONTACT_ENDPOINT);

const Contact = () => {
  const [formData, setFormData] = useState<ContactForm>({
    email: "",
    name: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    try {
      const token = getValidToken();
      if (token) {
        const currentUser = decodeToken(token);
        if (currentUser) {
          setFormData((prev) => ({
            ...prev,
            email: currentUser.email || "",
            name: currentUser.name || "",
          }));
        }
      }
    } catch (error) {
      // Silently fail - user can still fill in the form manually
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.email || !formData.name || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      await contactService.post(formData);

      toast({
        title: "Success",
        description: "Your message has been sent successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Clear form after successful submission
      setFormData({
        email: "",
        name: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.xl" py={12}>
      <VStack spacing={6} mb={16}>
        <Heading
          as="h1"
          fontSize={{ base: "clamp(2rem, 8vw, 4rem)", md: "clamp(2.5rem, 6vw, 5rem)", lg: "clamp(3rem, 5vw, 6rem)" }}
          textAlign="center"
          fontWeight="800"
          letterSpacing="-0.03em"
          lineHeight="1.1"
          mb={4}
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          Contact Us
        </Heading>
        <Text
          textAlign="center"
          fontSize="xl"
          color="gray.400"
          fontWeight="500"
          letterSpacing="0.01em"
          maxW="600px"
        >
          Any questions or remarks? Just write us a message!
        </Text>

        {/* Contact Form */}
        <Box w="100%" maxW="600px" mt={8}>
          <Stack spacing={6}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl isRequired>
                <FormLabel
                  fontSize="md"
                  fontWeight="600"
                  color="gray.300"
                  letterSpacing="0.01em"
                >
                  Email
                </FormLabel>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter a valid email address"
                  bg="gray.700"
                  border="1px solid"
                  borderColor="gray.600"
                  borderRadius="lg"
                  type="email"
                  fontSize="md"
                  fontWeight="400"
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.1)",
                  }}
                  _hover={{ borderColor: "gray.500" }}
                  transition="all 0.2s ease"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel
                  fontSize="md"
                  fontWeight="600"
                  color="gray.300"
                  letterSpacing="0.01em"
                >
                  Name
                </FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your Name"
                  bg="gray.700"
                  border="1px solid"
                  borderColor="gray.600"
                  borderRadius="lg"
                  fontSize="md"
                  fontWeight="400"
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.1)",
                  }}
                  _hover={{ borderColor: "gray.500" }}
                  transition="all 0.2s ease"
                />
              </FormControl>
            </SimpleGrid>
            <FormControl isRequired>
              <FormLabel
                fontSize="md"
                fontWeight="600"
                color="gray.300"
                letterSpacing="0.01em"
              >
                Message
              </FormLabel>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Write your message here..."
                bg="gray.700"
                border="1px solid"
                borderColor="gray.600"
                borderRadius="lg"
                rows={6}
                fontSize="md"
                fontWeight="400"
                resize="vertical"
                _focus={{
                  borderColor: "blue.400",
                  boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.1)",
                }}
                _hover={{ borderColor: "gray.500" }}
                transition="all 0.2s ease"
              />
            </FormControl>
            <Button
              w="100%"
              colorScheme="teal"
              bg="teal.400"
              size="lg"
              borderRadius="full"
              onClick={handleSubmit}
              isLoading={isLoading}
              loadingText="Sending..."
              fontSize="lg"
              fontWeight="600"
              letterSpacing="0.01em"
              py={6}
              _hover={{
                bg: "teal.500",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(20, 184, 166, 0.3)",
              }}
              _active={{
                bg: "teal.600",
                transform: "translateY(0)",
              }}
              transition="all 0.2s ease"
            >
              SUBMIT
            </Button>
          </Stack>
        </Box>
      </VStack>

      {/* Contact Information */}
      <Box
        bg="gray.800"
        p={12}
        borderRadius="xl"
        border="1px solid"
        borderColor="gray.700"
      >
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={12}>
          <VStack align="center" spacing={6}>
            <Circle
              size="80px"
              bg="teal.400"
              boxShadow="0 8px 25px rgba(20, 184, 166, 0.3)"
            >
              <Icon as={FaRunning} color="white" boxSize={8} />
            </Circle>
            <Heading
              size="md"
              color="teal.400"
              fontWeight="700"
              letterSpacing="-0.01em"
              textAlign="center"
            >
              RESOURCE TEAM
            </Heading>
            <VStack spacing={2} align="center">
              <Text color="gray.300" fontSize="md" fontWeight="500">
                Christian Fonkeng
              </Text>
              <Text color="gray.300" fontSize="md" fontWeight="500">
                Blaise Dong
              </Text>
              <Text color="gray.300" fontSize="md" fontWeight="500">
                Martial Wanji
              </Text>
            </VStack>
          </VStack>

          <VStack align="center" spacing={6}>
            <Circle
              size="80px"
              bg="teal.400"
              boxShadow="0 8px 25px rgba(20, 184, 166, 0.3)"
            >
              <Icon as={FaPhone} color="white" boxSize={8} />
            </Circle>
            <Heading
              size="md"
              color="teal.400"
              fontWeight="700"
              letterSpacing="-0.01em"
              textAlign="center"
            >
              PHONE (LANDLINE)
            </Heading>
            <VStack spacing={2} align="center">
              <Text color="gray.300" fontSize="md" fontWeight="500">
                +44 7735086910
              </Text>
              <Text color="gray.300" fontSize="md" fontWeight="500">
                +237 681389551
              </Text>
              <Text color="gray.300" fontSize="md" fontWeight="500">
                +237 672260392
              </Text>
            </VStack>
          </VStack>

          <VStack align="center" spacing={6}>
            <Circle
              size="80px"
              bg="teal.400"
              boxShadow="0 8px 25px rgba(20, 184, 166, 0.3)"
            >
              <Icon as={FaMapMarkerAlt} color="white" boxSize={8} />
            </Circle>
            <Heading
              size="md"
              color="teal.400"
              fontWeight="700"
              letterSpacing="-0.01em"
              textAlign="center"
            >
              OFFICE LOCATION
            </Heading>
            <VStack spacing={2} align="center">
              <Text color="gray.300" fontSize="md" fontWeight="500">
                The Sheet Music Pro
              </Text>
              <Text color="gray.300" fontSize="md" fontWeight="500">
                23 Clifford Street, Leicester, UK
              </Text>
            </VStack>
          </VStack>
        </SimpleGrid>
      </Box>
    </Container>
  );
};

export default Contact;
