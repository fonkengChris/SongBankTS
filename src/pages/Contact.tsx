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
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { useState, useEffect } from "react";
import APIClient from "../services/api-client";
import { CONTACT_ENDPOINT } from "../data/constants";
import jwtDecode from "jwt-decode";
import CurrentUser from "../entities/CurrentUser";
import useAuth from "../hooks/useAuth";

interface ContactForm {
  email: string;
  name: string;
  message: string;
}

const contactService = new APIClient<ContactForm>(CONTACT_ENDPOINT);

const Contact = () => {
  const { auth } = useAuth();
  const [formData, setFormData] = useState<ContactForm>({
    email: "",
    name: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    try {
      if (auth.access) {
        const currentUser = JSON.parse(atob(auth.access.split('.')[1]));
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
  }, [auth.access]);

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
        description: "Your message has been sent successfully! We'll get back to you soon.",
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
          Get in Touch
        </Heading>
        <Text
          textAlign="center"
          fontSize="xl"
          color="gray.400"
          fontWeight="500"
          letterSpacing="0.01em"
          maxW="600px"
        >
          Have questions about our sheet music library? Need technical support? We're here to help!
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
                  placeholder="Enter your email address"
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
                  placeholder="Enter your full name"
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
                placeholder="Tell us how we can help you..."
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
              colorScheme="blue"
              bg="blue.500"
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
                bg: "blue.600",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)",
              }}
              _active={{
                bg: "blue.700",
                transform: "translateY(0)",
              }}
              transition="all 0.2s ease"
            >
              Send Message
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
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
          <VStack align="center" spacing={6}>
            <Circle
              size="80px"
              bg="blue.500"
              boxShadow="0 8px 25px rgba(59, 130, 246, 0.3)"
            >
              <Icon as={FaEnvelope} color="white" boxSize={8} />
            </Circle>
            <Heading
              size="md"
              color="blue.400"
              fontWeight="700"
              letterSpacing="-0.01em"
              textAlign="center"
            >
              Email Support
            </Heading>
            <VStack spacing={2} align="center">
              <Text color="gray.300" fontSize="md" fontWeight="500">
                support@sheetmusiclibrary.com
              </Text>
              <Text color="gray.400" fontSize="sm" textAlign="center">
                For general inquiries and technical support
              </Text>
            </VStack>
          </VStack>

          <VStack align="center" spacing={6}>
            <Circle
              size="80px"
              bg="blue.500"
              boxShadow="0 8px 25px rgba(59, 130, 246, 0.3)"
            >
              <Icon as={FaPhone} color="white" boxSize={8} />
            </Circle>
            <Heading
              size="md"
              color="blue.400"
              fontWeight="700"
              letterSpacing="-0.01em"
              textAlign="center"
            >
              Phone Support
            </Heading>
            <VStack spacing={2} align="center">
              <Text color="gray.300" fontSize="md" fontWeight="500">
                +44 773 508 6910
              </Text>
              <Text color="gray.400" fontSize="sm" textAlign="center">
                Available during business hours
              </Text>
            </VStack>
          </VStack>

          <VStack align="center" spacing={6}>
            <Circle
              size="80px"
              bg="blue.500"
              boxShadow="0 8px 25px rgba(59, 130, 246, 0.3)"
            >
              <Icon as={FaMapMarkerAlt} color="white" boxSize={8} />
            </Circle>
            <Heading
              size="md"
              color="blue.400"
              fontWeight="700"
              letterSpacing="-0.01em"
              textAlign="center"
            >
              Office Location
            </Heading>
            <VStack spacing={2} align="center">
              <Text color="gray.300" fontSize="md" fontWeight="500">
                SheetMusicLibrary Ltd.
              </Text>
              <Text color="gray.300" fontSize="md" fontWeight="500">
                23 Clifford Street
              </Text>
              <Text color="gray.300" fontSize="md" fontWeight="500">
                Leicester, UK LE1 1AA
              </Text>
            </VStack>
          </VStack>

          <VStack align="center" spacing={6}>
            <Circle
              size="80px"
              bg="blue.500"
              boxShadow="0 8px 25px rgba(59, 130, 246, 0.3)"
            >
              <Icon as={FaClock} color="white" boxSize={8} />
            </Circle>
            <Heading
              size="md"
              color="blue.400"
              fontWeight="700"
              letterSpacing="-0.01em"
              textAlign="center"
            >
              Business Hours
            </Heading>
            <VStack spacing={2} align="center">
              <Text color="gray.300" fontSize="md" fontWeight="500">
                Mon - Fri: 9:00 AM - 6:00 PM
              </Text>
              <Text color="gray.300" fontSize="md" fontWeight="500">
                Sat: 10:00 AM - 4:00 PM
              </Text>
              <Text color="gray.400" fontSize="sm" textAlign="center">
                GMT Time Zone
              </Text>
            </VStack>
          </VStack>
        </SimpleGrid>
      </Box>

      {/* Additional Information */}
      <Box mt={12} textAlign="center">
        <Text color="gray.400" fontSize="md" maxW="800px" mx="auto">
          We typically respond to all inquiries within 24 hours during business days. 
          For urgent technical issues, please include "URGENT" in your message subject.
        </Text>
      </Box>
    </Container>
  );
};

export default Contact;
