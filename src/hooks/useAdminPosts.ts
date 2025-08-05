import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../services/api-client";
import { decodeToken } from "../utils/jwt-validator";
import { Post, PostsResponse } from "./usePosts";

interface CreatePostRequest {
  title: string;
  content: string;
  tags?: string[];
  excerpt?: string;
  featuredImage?: string;
  status?: "draft" | "published";
}

interface UpdatePostRequest {
  title?: string;
  content?: string;
  tags?: string[];
  excerpt?: string;
  featuredImage?: string;
  status?: "draft" | "published";
}

const useAdminPosts = (page: number = 1, limit: number = 10, status?: string) => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<PostsResponse>({
    queryKey: ["adminPosts", page, limit, status],
    queryFn: () => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (status) params.append("status", status);
      
      return axiosInstance
        .get(`/api/posts/admin?${params.toString()}`)
        .then((res: any) => res.data);
    },
  });

  const createPostMutation = useMutation({
    mutationFn: (data: CreatePostRequest) =>
      axiosInstance.post(`/api/posts`, data).then((res: any) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPosts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: ({ postId, data }: { postId: string; data: UpdatePostRequest }) =>
      axiosInstance.put(`/api/posts/${postId}`, data).then((res: any) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPosts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: (postId: string) =>
      axiosInstance.delete(`/api/posts/${postId}`).then((res: any) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPosts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const getCurrentUser = () => {
    const token = localStorage.getItem("token");
    return decodeToken(token);
  };

  const createPost = (data: CreatePostRequest) => {
    const user = getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "superAdmin")) throw new Error("Admin access required");
    return createPostMutation.mutateAsync(data);
  };

  const updatePost = (postId: string, data: UpdatePostRequest) => {
    const user = getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "superAdmin")) throw new Error("Admin access required");
    return updatePostMutation.mutateAsync({ postId, data });
  };

  const deletePost = (postId: string) => {
    const user = getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "superAdmin")) throw new Error("Admin access required");
    return deletePostMutation.mutateAsync(postId);
  };

  const isAdmin = () => {
    const user = getCurrentUser();
    return user && (user.role === "admin" || user.role === "superAdmin");
  };

  return {
    posts: data?.posts || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refetch,
    createPost,
    updatePost,
    deletePost,
    isAdmin,
    isCreatingPost: createPostMutation.isLoading,
    isUpdatingPost: updatePostMutation.isLoading,
    isDeletingPost: deletePostMutation.isLoading,
  };
};

export default useAdminPosts; 