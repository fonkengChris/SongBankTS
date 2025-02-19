import axios from "axios";
import {
  SONGS_ENDPOINT,
  MEDIA_FILES_ENDPOINT,
  MEDIA_BASE_URL,
} from "../data/constants";

export const useUnlike = (mediafileId: string) => {
  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: MEDIA_BASE_URL,
    headers: {
      "x-auth-token": token,
      "Content-Type": "application/json",
    },
  });

  const getMediafile = async () => {
    try {
      const response = await axiosInstance.get(
        `${MEDIA_FILES_ENDPOINT}/${mediafileId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching mediafile:", error);
      throw new Error("Failed to fetch mediafile");
    }
  };

  const unlikeSong = async () => {
    try {
      const mediafile = await getMediafile();
      if (!mediafile?.song?._id) {
        throw new Error("Invalid song data");
      }

      const songId = mediafile.song._id;
      const songResponse = await axiosInstance.get(
        `${SONGS_ENDPOINT}/${songId}`
      );
      const song = songResponse.data;

      if (!song) {
        throw new Error("Song not found");
      }

      const updatedLikesCount = Math.max((song.likesCount ?? 0) - 1, 0);
      const response = await axiosInstance.patch(
        `${SONGS_ENDPOINT}/${songId}`,
        {
          likesCount: updatedLikesCount,
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Unlike song error:", error);
      throw new Error(error.message || "Failed to unlike song");
    }
  };

  return { unlikeSong };
};

export default useUnlike;
