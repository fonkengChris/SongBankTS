import React from "react";
import { useNavigate, useParams } from "react-router-dom";
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
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "../services/api-client";
import { CATEGORIES_ENDPOINT } from "../data/constants";
import Category from "../entities/Category";

const apiClient = new APIClient<Category>(CATEGORIES_ENDPOINT);

interface CategoryFormData {
  title: string;
}

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>();

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
      return apiClient.patch(id, data, {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "en-US,en;q=0.9",
          "Content-Type": "application/json",
          "x-auth-token": `${localStorage.getItem("token")}`,
        },
      });
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
    <Box maxW="container.md" mx="auto" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading color="blue.500">
          {id ? "Edit Category" : "Add New Category"}
        </Heading>
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
                isLoading={createMutation.isLoading || updateMutation.isLoading}
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
  );
};

export default CategoryForm;
