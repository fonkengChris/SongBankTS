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
      const access = localStorage.getItem("token");
      const currentUser = jwtDecode<CurrentUser>(access!);
      setFormData((prev) => ({
        ...prev,
        email: currentUser.email || "",
        name: currentUser.name || "",
      }));
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
    <Container maxW="container.xl" py={10}>
      <VStack spacing={4} mb={12}>
        <Heading as="h1" size="xl" textAlign="center">
          Contact Us
        </Heading>
        <Text textAlign="center" fontSize="lg">
          Any questions or remarks? Just write us a message!
        </Text>

        {/* Contact Form */}
        <Box w="100%" maxW="600px" mt={6}>
          <Stack spacing={4}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter a valid email address"
                  bg="gray.700"
                  border="none"
                  borderRadius="md"
                  type="email"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your Name"
                  bg="gray.700"
                  border="none"
                  borderRadius="md"
                />
              </FormControl>
            </SimpleGrid>
            <FormControl isRequired>
              <FormLabel>Message</FormLabel>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Write your message here..."
                bg="gray.700"
                border="none"
                borderRadius="md"
                rows={4}
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
            >
              SUBMIT
            </Button>
          </Stack>
        </Box>
      </VStack>

      {/* Contact Information */}
      <Box bg="gray.100" p={10} borderRadius="lg">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <VStack align="center" spacing={4}>
            <Circle size="60px" bg="teal.400">
              <Icon as={FaRunning} color="white" boxSize={6} />
            </Circle>
            <Heading size="md" color="teal.400">
              RESOURSE TEAM
            </Heading>
            <VStack spacing={1} align="center">
              <Text color="gray.600">Christian Fonkeng</Text>
              <Text color="gray.600">Blaise Dong</Text>
              <Text color="gray.600">Martial Wanji </Text>
            </VStack>
          </VStack>

          <VStack align="center" spacing={4}>
            <Circle size="60px" bg="teal.400">
              <Icon as={FaPhone} color="white" boxSize={6} />
            </Circle>
            <Heading size="md" color="teal.400">
              PHONE (LANDLINE)
            </Heading>
            <VStack spacing={1} align="center">
              <Text color="gray.600">+44 7735086910</Text>
              <Text color="gray.600">+237 681389551</Text>
              <Text color="gray.600">+237 672260392</Text>
            </VStack>
          </VStack>

          <VStack align="center" spacing={4}>
            <Circle size="60px" bg="teal.400">
              <Icon as={FaMapMarkerAlt} color="white" boxSize={6} />
            </Circle>
            <Heading size="md" color="teal.400">
              OFFICE LOCATION
            </Heading>
            <VStack spacing={1} align="center">
              <Text color="gray.600">The Sheet Music Pro</Text>
              <Text color="gray.600">23 Clifford Street, Leicester, UK</Text>
            </VStack>
          </VStack>
        </SimpleGrid>
      </Box>
    </Container>
  );
};

export default Contact;
