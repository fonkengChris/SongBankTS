import likeService from "../services/like-service";

export const useUnlike = () => {
  const unlikeSong = async (songId: string) => {
    try {
      const response = await likeService.unlikeSong(songId);
      return {
        success: true,
        data: response,
        message: "Song unliked successfully",
      };
    } catch (error: any) {
      console.error("Unlike song error:", error);
      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.message ||
          "Failed to unlike song",
        status: error.response?.status,
      };
    }
  };

  return { unlikeSong };
};

export default useUnlike;
