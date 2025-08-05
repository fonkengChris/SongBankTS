import React from "react";
import { IconButton, Text, HStack, useToast } from "@chakra-ui/react";
import { FiHeart } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../services/api-client";

interface CommentLikeProps {
  commentId: string;
  isLiked: boolean;
  likesCount: number;
}

const CommentLike: React.FC<CommentLikeProps> = ({ commentId, isLiked, likesCount }) => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(`/api/comment-likes/${commentId}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch comments to update like status
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to like comment",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.delete(`/api/comment-likes/${commentId}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch comments to update like status
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to unlike comment",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const handleLikeToggle = () => {
    if (isLiked) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };

  const isLoading = likeMutation.isLoading || unlikeMutation.isLoading;

  return (
    <HStack spacing={1}>
      <IconButton
        aria-label={isLiked ? "Unlike comment" : "Like comment"}
        icon={<FiHeart />}
        size="sm"
        variant="ghost"
        colorScheme={isLiked ? "red" : "gray"}
        onClick={handleLikeToggle}
        isLoading={isLoading}
        isDisabled={isLoading}
      />
      {likesCount > 0 && (
        <Text fontSize="xs" color="gray.500">
          {likesCount}
        </Text>
      )}
    </HStack>
  );
};

export default CommentLike; 