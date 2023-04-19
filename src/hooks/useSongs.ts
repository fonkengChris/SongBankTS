import useData from "./useData";
// import { GameQuery } from "../App";
import { Category } from "./useCategories";
import { SongQuery } from "../App";

export interface Notation {
  id: number;
  title: string;
  slug: string;
}

export interface Song {
  id: number;
  title: string;
  author_name: string;
  preview_image: any[];
  notation: { title: string };
  metacritic: number;
}

const useSongs = (songQuery: SongQuery) =>
  useData<Song>(
    "/songs",
    {
      params: {
        category: songQuery.category?.id,
        notation: songQuery.notation?.id,
      },
    },
    [songQuery]
  );
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
