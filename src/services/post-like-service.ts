import { axiosInstance } from "./api-client";
import { POST_LIKES_ENDPOINT } from "../data/constants";

export interface PostLikeStatus {
  isLiked: boolean;
  postId: string;
  likesCount: number;
}

export interface PostLikeResponse {
  message: string;
  like: {
    _id: string;
    user: any;
    post: any;
    createdAt: string;
  };
}

export interface PostUnlikeResponse {
  message: string;
  postId: string;
}

export interface PostLikeCountResponse {
  postId: string;
  likesCount: number;
}

class PostLikeService {
  // Like a post
  async likePost(postId: string): Promise<PostLikeResponse> {
    if (!postId || postId.trim() === "") {
      throw new Error("Invalid post ID");
    }
    const response = await axiosInstance.post(POST_LIKES_ENDPOINT, {
      post: postId,
    });
    return response.data;
  }

  // Unlike a post
  async unlikePost(postId: string): Promise<PostUnlikeResponse> {
    if (!postId || postId.trim() === "") {
      throw new Error("Invalid post ID");
    }
    const response = await axiosInstance.delete(`${POST_LIKES_ENDPOINT}/${postId}`);
    return response.data;
  }

  // Check if user has liked a specific post
  async getPostLikeStatus(postId: string): Promise<PostLikeStatus> {
    if (!postId || postId.trim() === "") {
      throw new Error("Invalid post ID");
    }
    const response = await axiosInstance.get(`${POST_LIKES_ENDPOINT}/${postId}`);
    return response.data;
  }

  // Get like count for a post
  async getPostLikeCount(postId: string): Promise<PostLikeCountResponse> {
    if (!postId || postId.trim() === "") {
      throw new Error("Invalid post ID");
    }
    const response = await axiosInstance.get(
      `${POST_LIKES_ENDPOINT}/post/${postId}/count`
    );
    return response.data;
  }
}

export const postLikeService = new PostLikeService();
export default postLikeService; 