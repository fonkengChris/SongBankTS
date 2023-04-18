// import genres from "../data/genres";

import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { Song } from "./useSongs";
import { CanceledError } from "axios";

export interface Category {
  id: number;
  title: string;
}

const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    apiClient
      .get<Category[]>("/categories", { signal: controller.signal })
      .then((res) => {
        setCategories(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return { categories, error, isLoading };
};
// const useGenres = () => ({ data: genres, isLoading: false, error: null });
// const useGenres = () => useData<Genre>("/genres");
export default useCategories;
