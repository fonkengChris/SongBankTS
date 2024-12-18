import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/api-client";
import ms from "ms";
import { AUDIOS_ENDPOINT } from "../data/constants";
import SongAudio from "../entities/SongAudio";

const apiClient = new APIClient<SongAudio>(AUDIOS_ENDPOINT);

const useAudios = () =>
  useQuery({
    queryKey: ["audios"],
    queryFn: apiClient.getAll,
    staleTime: ms("24h"),
  });



export default useAudios;
