import {
  Box,
  Button,
  ChakraProvider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  useToast,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import APIClient from "../services/api-client";
import { NOTATIONS_ENDPOINT } from "../data/constants";
import Notation from "../entities/Notation";
import { NotationFormData } from "../types/forms";

const apiClient = new APIClient<Notation, NotationFormData>(NOTATIONS_ENDPOINT);

const NotationFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [notation, setNotation] = useState<NotationFormData>({
    title: "",
    slug: "",
  });
  const inputBg = useColorModeValue("white", "gray.700");
  const inputColor = useColorModeValue("gray.800", "gray.100");

  useEffect(() => {
    if (id) {
      // Fetch existing notation for editing
      apiClient.get(id).then((data) => setNotation(data));
    }
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (id) {
        await apiClient.put(id, notation);
        toast({ title: "Notation updated successfully", status: "success" });
      } else {
        await apiClient.post(notation as Notation);
        toast({ title: "Notation created successfully", status: "success" });
      }
      navigate("/admin/notations");
    } catch (error) {
      toast({
        title: "Error saving notation",
        description: "Please try again",
        status: "error",
      });
    }
  };

  return (
    <Box maxW="container.md" mx="auto" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading color="blue.500">
          {id ? "Edit Notation" : "Add Notation"}
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel color="blue.500">Title</FormLabel>
              <Input
                value={notation.title}
                onChange={(e) =>
                  setNotation({ ...notation, title: e.target.value })
                }
                bg={inputBg}
                color={inputColor}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color="blue.500">Slug</FormLabel>
              <Input
                value={notation.slug}
                onChange={(e) =>
                  setNotation({ ...notation, slug: e.target.value })
                }
                bg={inputBg}
                color={inputColor}
              />
            </FormControl>

            <Flex gap={4}>
              <Button
                onClick={() => navigate("/admin/notations")}
                colorScheme="red"
                flex={1}
                minW="140px"
              >
                Cancel
              </Button>
              <Button type="submit" colorScheme="blue" flex={1} minW="140px">
                {id ? "Update" : "Create"} Notation
              </Button>
            </Flex>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default NotationFormPage;
