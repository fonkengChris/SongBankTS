// import genres from "../data/genres";

import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { Song } from "./useSongs";
import { CanceledError } from "axios";
import useData from "./useData";

export interface Category {
  id: number;
  title: string;
}

// const useCategories = () => ({ data: categories, isLoading: false, error: null });
const useCategories = () => useData<Category>("/categories");
export default useCategories;
