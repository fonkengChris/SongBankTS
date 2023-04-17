import { useEffect, useState } from "react";
import useData from "./useData";
import apiClient from "../services/api-client";
import { CanceledError } from "axios";
// import { GameQuery } from "../App";

export interface Notation {
  id: number;
  title: string;
}

export interface Song {
  id: number;
  title: string;
  authora_name: string;
}

const useSongs = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    apiClient
      .get<Song[]>("/songs", { signal: controller.signal })
      .then((res) => {
        // console.log(res);
        setSongs(res.data);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
      });

    return () => controller.abort();
  }, []);

  return { songs, error };
};

export default useSongs;

// const useSongs = (gameQuery: GameQuery) =>
//   useData<Game>(
//     "/games",
//     {
//       params: {
//         genres: gameQuery.genre?.id,
//         platforms: gameQuery.platform?.id,
//         ordering: gameQuery.sortOrder,
//         search: gameQuery.seachText,
//       },
//     },
//     [gameQuery]
//   );

// export default useSongs;
