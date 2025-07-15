import { useQuery } from "@tanstack/react-query";
import languages from "../data/languages";
import APIClient from "../services/api-client";
import ms from "ms";
import { LANGUAGES_ENDPOINT } from "../data/constants";
import Language from "../entities/Language";

const apiClient = new APIClient<Language>(LANGUAGES_ENDPOINT);

const useLanguages = () =>
  useQuery({
    queryKey: ["languages"],
    queryFn: apiClient.getAll,
    staleTime: ms("24h"),
    // initialData: languages,
  });
export default useLanguages;
