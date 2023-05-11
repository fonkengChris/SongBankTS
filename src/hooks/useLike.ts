import React from "react";
import APIClient, { axiosInstance } from "../services/api-client";
import { SONGS_ENDPOINT } from "../data/constants";
import Song from "../entities/Song";
import useSong from "./useSong";

const apiClient = new APIClient<Song>(SONGS_ENDPOINT);

interface Props {
  id: number;
}

// const useLike = ({ id }: Props) => {
//   const song = useSong(id);
//   const count = axiosInstance.patch(song.data?.id!, {
//     entity: 
//   });
// };

export default useLike;
