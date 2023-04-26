import { useQuery } from "@tanstack/react-query";
import notations from "../data/notations";
import APIClient from "../services/api-client";
import ms from "ms";
import { NOTATIONS_ENDPOINT } from "../data/constants";
import Notation from "../entities/Notation";

const apiClient = new APIClient<Notation>(NOTATIONS_ENDPOINT);

const useNotations = () =>
  useQuery({
    queryKey: ["notations"],
    queryFn: apiClient.getAll,
    staleTime: ms("24h"),
    initialData: notations,
  });

export default useNotations;
