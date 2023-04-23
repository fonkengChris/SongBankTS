import { useQuery } from "@tanstack/react-query";
import categories from "../data/categories";
import apiClient from "../services/api-client";
import ms from "ms";

// import useData from "./useData";

export interface Category {
  id: number;
  title: string;
}

const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      apiClient.get<Category[]>("/library/categories").then((res) => res.data),
    staleTime: ms("24h"),
    initialData: categories,
  });
// const useCategories = () => useData<Category>("/categories");
export default useCategories;
