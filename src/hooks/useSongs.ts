import { useQuery } from "@tanstack/react-query";
import { SongQuery } from "../components/common/HomePage";
import apiClient from "../services/api-client";

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
  useQuery<Song[], Error>({
    queryKey: ["songs", songQuery],
    queryFn: () =>
      apiClient
        .get<Song[]>("/library/songs", {
          params: {
            category: songQuery.category?.id,
            notation: songQuery.notation?.id,
            ordering: songQuery.sortOrder,
            search: songQuery.searchText,
          },
        })
        .then((res) => res.data),
  });
export default useSongs;
