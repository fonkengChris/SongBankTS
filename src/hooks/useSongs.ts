import { useQuery } from "@tanstack/react-query";
import useSongQueryStore from "../Store";
import { SONGS_ENDPOINT } from "../data/constants";
import APIClient from "../services/api-client";
import Song from "../entities/Song";

const apiClient = new APIClient<Song>(SONGS_ENDPOINT);

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
