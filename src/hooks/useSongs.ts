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
  author_name: string;
  preview_image: any[];
  notation: { title: string };
  metacritic: number;
}

const useSongs = () => useData<Song>("/songs");
// const useSongs = () => {
//   const [songs, setSongs] = useState<Song[]>([]);
//   const [error, setError] = useState("");
//   const [isLoading, setLoading] = useState(false);

//   useEffect(() => {
//     const controller = new AbortController();

//     setLoading(true);
//     apiClient
//       .get<Song[]>("/songs", { signal: controller.signal })
//       .then((res) => {
//         setSongs(res.data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         if (err instanceof CanceledError) return;
//         setError(err.message);
//         setLoading(false);
//       });

//     return () => controller.abort();
//   }, []);

//   return { songs, error, isLoading };
// };

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
