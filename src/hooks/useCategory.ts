import Category from "../entities/Category";
import useCategories from "./useCategories";

const useCategory = (id?: Category | string | null) => {
  const { data: categories } = useCategories();
  return categories!.find((c) => c._id === id);
};

export default useCategory;
