import { useQuery } from "@tanstack/react-query";
import { SongQuery } from "../components/common/HomePage";
import APIClient from "../services/api-client";
import { SONGS_ENDPOINT } from "../data/constants";

const apiClient = new APIClient<Song>(SONGS_ENDPOINT);

export interface Song {
  id: number;
  title: string;
  author_name: string;
  preview_image: any[];
  notation: { title: string };
  metacritic: number;
}

const useSongs = (songQuery: SongQuery) =>
  useQuery<Song[], Error>({
    queryKey: ["songs", songQuery],
    queryFn: () =>
      apiClient.getAll({
        params: {
          category: songQuery.category?.id,
          notation: songQuery.notation?.id,
          ordering: songQuery.sortOrder,
          search: songQuery.searchText,
        },
      }),
  });
export default useSongs;
