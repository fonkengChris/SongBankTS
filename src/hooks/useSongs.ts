
// import useData from "./useData";
// // import { GameQuery } from "../App";

// export interface Platform {
//   id: number;
//   name: string;
//   slug: string;
// }

// export interface Game {
//   id: number;
//   name: string;
//   background_image: string;
//   parent_platforms: { platform: Platform }[];
//   metacritic: number;
//   rating_top: number;
// }

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
