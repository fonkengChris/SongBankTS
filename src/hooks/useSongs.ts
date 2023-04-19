import useData from "./useData";
// import { GameQuery } from "../App";
import { Category } from "./useCategories";

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

const useSongs = (
  selectedCategory: Category | null,
  selectedNotation: Notation | null
) =>
  useData<Song>(
    "/songs",
    {
      params: {
        category: selectedCategory?.id,
        notation: selectedNotation?.id,
      },
    },
    [selectedCategory?.id, selectedNotation?.id]
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
