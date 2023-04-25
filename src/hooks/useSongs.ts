import { useQuery } from "@tanstack/react-query";
import useSongQueryStore from "../Store";
import { SONGS_ENDPOINT } from "../data/constants";
import APIClient from "../services/api-client";

const apiClient = new APIClient<Song>(SONGS_ENDPOINT);

export interface Song {
  id: number;
  title: string;
  author_name: string;
  preview_image: any[];
  notation: { title: string };
  metacritic: number;
}

const useSongs = () => {
  const songQuery = useSongQueryStore((s) => s.songQuery);
  return useQuery<Song[], Error>({
    queryKey: ["songs", songQuery],
    queryFn: () =>
      apiClient.getAll({
        params: {
          category: songQuery.categoryId,
          notation: songQuery.notationId,
          ordering: songQuery.sortOrder,
          search: songQuery.searchText,
        },
      }),
  });
};
export default useSongs;
