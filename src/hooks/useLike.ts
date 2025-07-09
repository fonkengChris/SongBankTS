import likeService from "../services/like-service";

export const useLike = () => {
  const likeSong = async (songId: string) => {
    try {
      const response = await likeService.likeSong(songId);
      return {
        success: true,
        data: response,
        message: "Song liked successfully",
      };
    } catch (error: any) {
      console.error("Like song error:", error);
      return {
        success: false,
        error:
          error.response?.data?.error || error.message || "Failed to like song",
        status: error.response?.status,
      };
    }
  };

  return { likeSong };
};

export default useLike;
