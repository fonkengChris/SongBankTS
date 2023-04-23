import { useQuery } from "@tanstack/react-query";
import categories from "../data/categories";
import APIClient from "../services/api-client";
import ms from "ms";
import { CATEGORIES_ENDPOINT } from "../data/constants";

const apiClient = new APIClient<Category>(CATEGORIES_ENDPOINT);

export interface Category {
  id: number;
  title: string;
}

const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: apiClient.getAll,
    staleTime: ms("24h"),
    initialData: categories,
  });
// const useCategories = () => useData<Category>("/categories");
export default useCategories;
