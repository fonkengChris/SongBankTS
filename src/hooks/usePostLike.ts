import postLikeService from "../services/post-like-service";

export const usePostLike = () => {
  const likePost = async (postId: string) => {
    try {
      const response = await postLikeService.likePost(postId);
      return {
        success: true,
        data: response,
        message: "Post liked successfully",
      };
    } catch (error: any) {
      console.error("Like post error:", error);
      return {
        success: false,
        error:
          error.response?.data?.error || error.message || "Failed to like post",
        status: error.response?.status,
      };
    }
  };

  const unlikePost = async (postId: string) => {
    try {
      const response = await postLikeService.unlikePost(postId);
      return {
        success: true,
        data: response,
        message: "Post unliked successfully",
      };
    } catch (error: any) {
      console.error("Unlike post error:", error);
      return {
        success: false,
        error:
          error.response?.data?.error || error.message || "Failed to unlike post",
        status: error.response?.status,
      };
    }
  };

  const getPostLikeStatus = async (postId: string) => {
    try {
      const response = await postLikeService.getPostLikeStatus(postId);
      return {
        success: true,
        data: response,
      };
    } catch (error: any) {
      console.error("Get post like status error:", error);
      return {
        success: false,
        error:
          error.response?.data?.error || error.message || "Failed to get post like status",
        status: error.response?.status,
      };
    }
  };

  return { likePost, unlikePost, getPostLikeStatus };
};

export default usePostLike; 