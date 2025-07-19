import React, { useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Heading,
  useColorModeValue,
  Flex,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "../services/api-client";
import Category from "../entities/Category";
import { CategoryFormData } from "../types/forms";

// interface CategoryFormData {
//   title: string;
// }

const CategoryFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const apiClient = new APIClient<Category, CategoryFormData>(
    "/api/categories"
  );

  // Color mode values for consistent styling
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const inputBg = useColorModeValue("white", "gray.700");
  const inputColor = useColorModeValue("gray.800", "gray.100");
  const inputBorderColor = useColorModeValue("gray.300", "gray.600");
  const inputFocusBorderColor = useColorModeValue("blue.500", "blue.300");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CategoryFormData>();

  useEffect(() => {
    if (id) {
      apiClient
        .get(id)
        .then((category) => {
          setValue("title", category.title);
        })
        .catch((error) => {
          toast({
            title: "Error fetching category",
            description: error.message,
            status: "error",
          });
          navigate("/admin/category");
        });
    }
  }, [id, setValue, navigate, toast]);

  const createMutation = useMutation({
    mutationFn: (data: CategoryFormData) => apiClient.post(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: "Category created successfully", status: "success" });
      navigate("/admin/category");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: CategoryFormData) => {
      if (!id) throw new Error("No ID provided");
      return apiClient.patch(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: "Category updated successfully", status: "success" });
      navigate("/admin/category");
    },
  });

  const onSubmit = (data: CategoryFormData) => {
    if (id) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Box maxW="container.md" mx="auto" py={8} px={6}>
      <VStack spacing={8} align="stretch">
        <Heading color="blue.500" fontWeight="bold" textAlign="center">
          {id ? "Edit Category" : "Create Category"}
        </Heading>
        
        <Card 
          bg={bgColor} 
          shadow="md" 
          border="1px solid" 
          borderColor={borderColor}
          borderRadius="lg"
        >
          <CardBody p={8}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={6} align="stretch">
                <FormControl isInvalid={!!errors.title}>
                  <FormLabel color="blue.500" fontWeight="semibold" mb={2}>Category Title</FormLabel>
                  <Input
                    {...register("title", { required: "Title is required" })}
                    placeholder="Enter category title"
                    bg={inputBg}
                    color={inputColor}
                    borderColor={inputBorderColor}
                    _hover={{ borderColor: inputFocusBorderColor }}
                    _focus={{ 
                      borderColor: inputFocusBorderColor, 
                      boxShadow: `0 0 0 1px ${inputFocusBorderColor}` 
                    }}
                    transition="all 0.2s"
                    size="lg"
                  />
                </FormControl>

                <Flex gap={4} pt={4}>
                  <Button
                    onClick={() => navigate("/admin/category")}
                    colorScheme="red"
                    flex={1}
                    minW="140px"
                    size="lg"
                    _hover={{ transform: "translateY(-1px)", boxShadow: "lg" }}
                    transition="all 0.2s"
                  >
                    Cancel
                  </Button>
                  <Button
                    colorScheme="blue"
                    type="submit"
                    isLoading={
                      createMutation.isLoading || updateMutation.isLoading
                    }
                    flex={1}
                    minW="140px"
                    size="lg"
                    _hover={{ transform: "translateY(-1px)", boxShadow: "lg" }}
                    transition="all 0.2s"
                  >
                    {id ? "Update Category" : "Create Category"}
                  </Button>
                </Flex>
              </VStack>
            </form>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default CategoryFormPage;
