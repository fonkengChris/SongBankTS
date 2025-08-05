import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../services/api-client";
import { decodeToken } from "../utils/jwt-validator";

export interface Comment {
  _id: string;
  songId: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    picture?: string;
  };
  comment: string;
  parentId?: string;
  mentions?: {
    _id: string;
    name: string;
    email: string;
    picture?: string;
  }[];
  depth: number;
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface CommentsResponse {
  comments: Comment[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalComments: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface AddCommentRequest {
  comment: string;
  parentId?: string;
  mentions?: string[];
}

interface UpdateCommentRequest {
  comment: string;
  mentions?: string[];
}

const useComments = (songId: string, page: number = 1, limit: number = 10) => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<CommentsResponse>({
    queryKey: ["comments", songId, page, limit],
    queryFn: () =>
      axiosInstance
        .get(`/api/comments/${songId}?page=${page}&limit=${limit}`)
        .then((res: any) => res.data),
    enabled: !!songId,
  });

  const addCommentMutation = useMutation({
    mutationFn: (data: AddCommentRequest) =>
      axiosInstance.post(`/api/comments/${songId}`, data).then((res: any) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", songId] });
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, data }: { commentId: string; data: UpdateCommentRequest }) =>
      axiosInstance.put(`/api/comments/${commentId}`, data).then((res: any) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", songId] });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) =>
      axiosInstance.delete(`/api/comments/${commentId}`).then((res: any) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", songId] });
    },
  });

  const getCurrentUser = () => {
    const token = localStorage.getItem("token");
    return decodeToken(token);
  };

  const addComment = (comment: string, parentId?: string, mentions?: string[]) => {
    const user = getCurrentUser();
    if (!user) throw new Error("User must be logged in to comment");
    return addCommentMutation.mutateAsync({ comment, parentId, mentions });
  };

  const updateComment = (commentId: string, comment: string, mentions?: string[]) => {
    const user = getCurrentUser();
    if (!user) throw new Error("User must be logged in to update comment");
    return updateCommentMutation.mutateAsync({ commentId, data: { comment, mentions } });
  };

  const deleteComment = (commentId: string) => {
    const user = getCurrentUser();
    if (!user) throw new Error("User must be logged in to delete comment");
    return deleteCommentMutation.mutateAsync(commentId);
  };

  const canEditComment = (comment: Comment) => {
    const user = getCurrentUser();
    return user && (comment.userId._id === user._id || user.role === "admin" || user.role === "superAdmin");
  };

  const canDeleteComment = (comment: Comment) => {
    const user = getCurrentUser();
    return user && (comment.userId._id === user._id || user.role === "admin" || user.role === "superAdmin");
  };

  return {
    comments: data?.comments || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refetch,
    addComment,
    updateComment,
    deleteComment,
    canEditComment,
    canDeleteComment,
    isAddingComment: addCommentMutation.isLoading,
    isUpdatingComment: updateCommentMutation.isLoading,
    isDeletingComment: deleteCommentMutation.isLoading,
  };
};

export default useComments; 