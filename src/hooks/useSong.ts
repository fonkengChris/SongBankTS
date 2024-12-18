import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/api-client";
import Song from "../entities/Song";
import { SONGS_ENDPOINT } from "../data/constants";

const apiClient = new APIClient<Song>(SONGS_ENDPOINT);

const useSong = (id: string) =>
  useQuery({
    queryKey: ["songs", id],
    queryFn: () => apiClient.get(id),
  });

export default useSong;
