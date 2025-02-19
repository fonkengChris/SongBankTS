import { useQuery } from "@tanstack/react-query";
import notations from "../data/notations";
import { axiosInstance } from "../services/api-client";
import ms from "ms";
import Notation from "../entities/Notation";
import { NOTATIONS_ENDPOINT } from "../data/constants";

const useNotations = () =>
  useQuery<Notation[]>({
    queryKey: ["notations"],
    queryFn: () =>
      axiosInstance.get(NOTATIONS_ENDPOINT).then((res) => res.data),
    staleTime: ms("24h"),
    initialData: notations,
  });

export default useNotations;
