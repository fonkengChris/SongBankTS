import commentLikeService from "../services/comment-like-service";

export const useCommentLike = () => {
  const likeComment = async (commentId: string) => {
    try {
      const response = await commentLikeService.likeComment(commentId);
      return {
        success: true,
        data: response,
        message: "Comment liked successfully",
      };
    } catch (error: any) {
      console.error("Like comment error:", error);
      return {
        success: false,
        error:
          error.response?.data?.error || error.message || "Failed to like comment",
        status: error.response?.status,
      };
    }
  };

  const unlikeComment = async (commentId: string) => {
    try {
      const response = await commentLikeService.unlikeComment(commentId);
      return {
        success: true,
        data: response,
        message: "Comment unliked successfully",
      };
    } catch (error: any) {
      console.error("Unlike comment error:", error);
      return {
        success: false,
        error:
          error.response?.data?.error || error.message || "Failed to unlike comment",
        status: error.response?.status,
      };
    }
  };

  const getCommentLikeStatus = async (commentId: string) => {
    try {
      const response = await commentLikeService.getCommentLikeStatus(commentId);
      return {
        success: true,
        data: response,
      };
    } catch (error: any) {
      console.error("Get comment like status error:", error);
      return {
        success: false,
        error:
          error.response?.data?.error || error.message || "Failed to get comment like status",
        status: error.response?.status,
      };
    }
  };

  return { likeComment, unlikeComment, getCommentLikeStatus };
};

export default useCommentLike; 