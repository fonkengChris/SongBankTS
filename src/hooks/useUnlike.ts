import React from "react";
import { MEDIA_BASE_URL, SONGS_ENDPOINT } from "../data/constants";
import Song from "../entities/Song";
import useSong from "./useSong";
import axios from "axios";

interface Props {
  id: string;
}

export const useUnlike = (id: string) => {
  const { song } = useSong(id); // Get the song details using the hook

  const unLikeSong = async () => {
    if (!song) {
      console.error("Song not found");
      return;
    }
    try {
      const updatedLikesCount = song.likesCount - 1;

      const response = await axios.patch(
        `${SONGS_ENDPOINT}/${id}`,
        {
          likesCount: updatedLikesCount, // Incrementing likesCount
        },
        {
          headers: {
            "x-auth-token": `${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Error liking the song:", err);
      throw err;
    }
  };

  return { unLikeSong };
};

export default useUnlike;
