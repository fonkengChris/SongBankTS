import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/api-client";
import ms from "ms";
import { DOCUMENTS_ENDPOINT } from "../data/constants";
import SongDocument from "../entities/SongMedia";

const apiClient = new APIClient<SongDocument>(DOCUMENTS_ENDPOINT);

const useDocuments = () =>
  useQuery({
    queryKey: ["documents"],
    queryFn: apiClient.getAll,
    staleTime: ms("24h"),
  });

export default useDocuments;
