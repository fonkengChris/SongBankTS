import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/api-client";
import Song from "../entities/Song";

const apiClient = new APIClient<Song>("/library/songs");

const useSong = (id: number) =>
  useQuery({
    queryKey: ["songs", id],
    queryFn: () => apiClient.get(id),
  });

export default useSong;
