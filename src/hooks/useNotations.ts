import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/api-client";
import Notation from "../entities/Notation";

const apiClient = new APIClient<Notation>("/api/notations");

const useNotations = () => {
  return useQuery({
    queryKey: ["notations"],
    queryFn: apiClient.getAll,
  });
};

export default useNotations;
