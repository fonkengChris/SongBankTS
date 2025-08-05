import { axiosInstance } from "./api-client";
import { COMMENT_LIKES_ENDPOINT } from "../data/constants";

export interface CommentLikeStatus {
  isLiked: boolean;
  commentId: string;
  likesCount: number;
}

export interface CommentLikeResponse {
  message: string;
  like: {
    _id: string;
    user: any;
    comment: any;
    createdAt: string;
  };
}

export interface CommentUnlikeResponse {
  message: string;
  commentId: string;
}

export interface CommentLikeCountResponse {
  commentId: string;
  likesCount: number;
}

class CommentLikeService {
  // Like a comment
  async likeComment(commentId: string): Promise<CommentLikeResponse> {
    if (!commentId || commentId.trim() === "") {
      throw new Error("Invalid comment ID");
    }
    const response = await axiosInstance.post(COMMENT_LIKES_ENDPOINT, {
      comment: commentId,
    });
    return response.data;
  }

  // Unlike a comment
  async unlikeComment(commentId: string): Promise<CommentUnlikeResponse> {
    if (!commentId || commentId.trim() === "") {
      throw new Error("Invalid comment ID");
    }
    const response = await axiosInstance.delete(`${COMMENT_LIKES_ENDPOINT}/${commentId}`);
    return response.data;
  }

  // Check if user has liked a specific comment
  async getCommentLikeStatus(commentId: string): Promise<CommentLikeStatus> {
    if (!commentId || commentId.trim() === "") {
      throw new Error("Invalid comment ID");
    }
    const response = await axiosInstance.get(`${COMMENT_LIKES_ENDPOINT}/${commentId}`);
    return response.data;
  }

  // Get like count for a comment
  async getCommentLikeCount(commentId: string): Promise<CommentLikeCountResponse> {
    if (!commentId || commentId.trim() === "") {
      throw new Error("Invalid comment ID");
    }
    const response = await axiosInstance.get(
      `${COMMENT_LIKES_ENDPOINT}/comment/${commentId}/count`
    );
    return response.data;
  }
}

export const commentLikeService = new CommentLikeService();
export default commentLikeService; 