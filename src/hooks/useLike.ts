import React from "react";
import { SONGS_ENDPOINT, MEDIA_FILES_ENDPOINT } from "../data/constants";
import axios from "axios";

interface Props {
  id: string;
}

export const useLike = (mediafileId: string) => {
  const getMediafile = async () => {
    const response = await axios.get(`${MEDIA_FILES_ENDPOINT}/${mediafileId}`, {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": `${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  };

  const likeSong = async () => {
    try {
      const mediafile = await getMediafile();
      const songId = mediafile.song._id;

      const songResponse = await axios.get(`${SONGS_ENDPOINT}/${songId}`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": `${localStorage.getItem("token")}`,
        },
      });
      const song = songResponse.data;

      if (!song) return;

      const updatedLikesCount = (song.likesCount ?? 0) + 1;
      const response = await axios.patch(
        `${SONGS_ENDPOINT}/${songId}`,
        {
          likesCount: updatedLikesCount,
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
      throw err;
    }
  };

  return { likeSong };
};

export default useLike;
