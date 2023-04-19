import categories from "../data/categories";

// import useData from "./useData";

export interface Category {
  id: number;
  title: string;
}

const useCategories = () => ({
  data: categories,
  isLoading: false,
  error: null,
});
// const useCategories = () => useData<Category>("/categories");
export default useCategories;
