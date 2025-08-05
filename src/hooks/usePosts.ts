import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../services/api-client";
import { decodeToken } from "../utils/jwt-validator";

export interface Post {
  _id: string;
  title: string;
  content: string;
  authorId: {
    _id: string;
    name: string;
    email: string;
    picture?: string;
  };
  tags: string[];
  slug: string;
  excerpt?: string;
  featuredImage?: string;
  status: "draft" | "published";
  likesCount?: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface PostsResponse {
  posts: Post[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

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

const usePosts = (page: number = 1, limit: number = 10, tag?: string, search?: string) => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<PostsResponse>({
    queryKey: ["posts", page, limit, tag, search],
    queryFn: () => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (tag) params.append("tag", tag);
      if (search) params.append("search", search);
      
      return axiosInstance
        .get(`/api/posts?${params.toString()}`)
        .then((res: any) => res.data);
    },
  });

  const createPostMutation = useMutation({
    mutationFn: (data: CreatePostRequest) =>
      axiosInstance.post(`/api/posts`, data).then((res: any) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: ({ postId, data }: { postId: string; data: UpdatePostRequest }) =>
      axiosInstance.put(`/api/posts/${postId}`, data).then((res: any) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: (postId: string) =>
      axiosInstance.delete(`/api/posts/${postId}`).then((res: any) => res.data),
    onSuccess: () => {
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

export default usePosts; 