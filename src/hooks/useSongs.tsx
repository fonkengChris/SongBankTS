import { useQuery } from "@tanstack/react-query";
import useSongQueryStore from "../Store";
import { SONGS_ENDPOINT } from "../data/constants";
import APIClient from "../services/api-client";
import Song from "../entities/Song";


const apiClient = new APIClient<Song>(SONGS_ENDPOINT);

const useSongs = () => {
  const songQuery = useSongQueryStore((s) => s.songQuery);

  const songs = useQuery<Song[], Error>({
    queryKey: ["songs", songQuery],
    queryFn: () =>
      apiClient.getAll({
        params: {
          category: songQuery.categoryId,
          language: songQuery.languageId,
          ordering: songQuery.sortOrder,
          search: songQuery.searchText,
        },
      }),
    cacheTime: 0,
  });

  // console.log(songs);
  return songs;
};
export default useSongs;
