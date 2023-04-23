import { useQuery } from "@tanstack/react-query";
import notations from "../data/notations";
import apiClient from "../services/api-client";
import ms from "ms";
// import useData from "./useData";

export interface Notation {
  id: number;
  title: string;
  slug: string;
}

// const useNotations = () => ({ data: notations, error: false });
const useNotations = () =>
  useQuery({
    queryKey: ["notations"],
    queryFn: () =>
      apiClient.get<Notation[]>("/library/notations").then((res) => res.data),
    staleTime: ms("24h"),
    initialData: notations,
  });

export default useNotations;
