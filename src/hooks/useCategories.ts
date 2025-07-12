import { useQuery } from "@tanstack/react-query";
import categories from "../data/categories";
import APIClient from "../services/api-client";
import ms from "ms";
import { CATEGORIES_ENDPOINT } from "../data/constants";
import Category from "../entities/Category";

const apiClient = new APIClient<Category>(CATEGORIES_ENDPOINT);

const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: apiClient.getAll,
    staleTime: ms("24h"),
  });

export default useCategories;
