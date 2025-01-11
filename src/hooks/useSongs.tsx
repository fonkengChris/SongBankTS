import { useInfiniteQuery } from "@tanstack/react-query";
import useSongQueryStore from "../Store";
import { SONGS_ENDPOINT } from "../data/constants";
import APIClient from "../services/api-client";
import Song from "../entities/Song";
import { PaginatedResponse } from "../services/api-client";

const apiClient = new APIClient<Song>(SONGS_ENDPOINT);

const useSongs = () => {
  const songQuery = useSongQueryStore((s) => s.songQuery);

  return useInfiniteQuery<PaginatedResponse<Song>, Error>({
    queryKey: ["songs", songQuery],
    queryFn: ({ pageParam = 1 }) =>
      apiClient.getAllSongs({
        params: {
          page: pageParam,
          category: songQuery.categoryId,
          language: songQuery.languageId,
          notation: songQuery.notationId,
          sortOrder: songQuery.sortOrder,
          searchText: songQuery.searchText,
        },
      }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.pagination.hasMore ? allPages.length + 1 : undefined;
    },
    cacheTime: 0,
  });
};

export default useSongs;
