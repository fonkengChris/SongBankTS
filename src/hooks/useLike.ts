import React from "react";
import { SONGS_ENDPOINT } from "../data/constants";
import useSong from "./useSong";
import axios from "axios";

interface Props {
  id: string;
}

export const useLike = (id: string) => {
  const { song } = useSong(id); // Get the song details using the hook

  const likeSong = async () => {
    if (!song) {
      console.error("Song not found");
      return;
    }
    try {
      // console.log(`Fetched song ${song.title}`);
      const updatedLikesCount = song.likesCount + 1;

      const response = await axios.patch(
        `${SONGS_ENDPOINT}/${id}`,
        {
          likesCount: updatedLikesCount, // Incrementing likesCount
        },
        {
          headers: {
            "Content-Type": "application/json",
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

  return { likeSong };
};

export default useLike;
