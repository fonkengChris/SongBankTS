import { useQuery } from "@tanstack/react-query";
import notations from "../data/notations";
import APIClient from "../services/api-client";
import ms from "ms";
import { NOTATIONS_ENDPOINT } from "../data/constants";

const apiClient = new APIClient<Notation>(NOTATIONS_ENDPOINT);

export interface Notation {
  id: number;
  title: string;
  slug: string;
}

const useNotations = () =>
  useQuery({
    queryKey: ["notations"],
    queryFn: apiClient.getAll,
    staleTime: ms("24h"),
    initialData: notations,
  });

export default useNotations;
