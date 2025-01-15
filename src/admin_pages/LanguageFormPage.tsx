import { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import APIClient from "../services/api-client";
import Language from "../entities/Language";
import { LanguageFormData } from "../types/forms";

const LanguageFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const apiClient = new APIClient<Language, LanguageFormData>("/api/languages");

  const inputBg = useColorModeValue("white", "gray.700");
  const inputColor = useColorModeValue("gray.800", "gray.100");

  const [formData, setFormData] = useState({
    name: "",
    code: "",
  });

  useEffect(() => {
    if (id) {
      apiClient
        .get(id)
        .then((language) =>
          setFormData({
            name: language.name,
            code: language.code,
          })
        )
        .catch((error) => {
          toast({
            title: "Error fetching language",
            description: error.message,
            status: "error",
          });
        });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await apiClient.put(id, formData);
        toast({
          title: "Language updated successfully",
          status: "success",
        });
      } else {
        await apiClient.post(formData);
        toast({
          title: "Language created successfully",
          status: "success",
        });
      }
      navigate("/admin/languages");
    } catch (error) {
      toast({
        title: "Error saving language",
        description:
          error instanceof Error ? error.message : "An error occurred",
        status: "error",
      });
    }
  };

  return (
    <Box maxW="container.md" mx="auto" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading color="blue.500">
          {id ? "Edit Language" : "Add New Language"}
        </Heading>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel color="blue.500">Language Name</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter language name"
                bg={inputBg}
                color={inputColor}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color="blue.500">Language Code</FormLabel>
              <Input
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="Enter language code (e.g., en, es, fr)"
                bg={inputBg}
                color={inputColor}
              />
            </FormControl>

            <Flex gap={4}>
              <Button
                onClick={() => navigate("/admin/languages")}
                colorScheme="red"
                flex={1}
                minW="140px"
              >
                Cancel
              </Button>
              <Button type="submit" colorScheme="blue" flex={1} minW="140px">
                {id ? "Update Language" : "Create Language"}
              </Button>
            </Flex>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default LanguageFormPage;
