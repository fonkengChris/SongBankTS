import React, { useEffect } from "react";
import {
  ChakraProvider,
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
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "../services/api-client";
import Category from "../entities/Category";

interface CategoryFormData {
  title: string;
}

const CategoryFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const apiClient = new APIClient<Category>("/api/categories");

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
    <ChakraProvider>
      <Box bg="gray.100" minHeight="100vh" p={4}>
        <Box bg="white" shadow="md" p={4} mb={4}>
          <Flex justifyContent="space-between" alignItems="center">
            <Heading color="blue.400" size="lg">
              {id ? "Edit Category" : "Create Category"}
            </Heading>
          </Flex>
        </Box>

        <Box maxW="container.md" mx="auto" py={8}>
          <VStack spacing={8} align="stretch">
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={4}>
                <FormControl isInvalid={!!errors.title}>
                  <FormLabel color="blue.500">Category Title</FormLabel>
                  <Input
                    {...register("title", { required: "Title is required" })}
                    placeholder="Enter category title"
                    bg={useColorModeValue("white", "gray.700")}
                    color={useColorModeValue("gray.800", "gray.100")}
                  />
                </FormControl>

                <Flex gap={4}>
                  <Button
                    onClick={() => navigate("/admin/category")}
                    colorScheme="red"
                    flex={1}
                    minW="140px"
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
                  >
                    {id ? "Update Category" : "Create Category"}
                  </Button>
                </Flex>
              </VStack>
            </form>
          </VStack>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default CategoryFormPage;
