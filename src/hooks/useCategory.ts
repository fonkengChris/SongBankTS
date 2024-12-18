import useCategories from "./useCategories";

const useCategory = (id?: string | null) => {
  const { data: categories } = useCategories();
  return categories!.find((c) => c._id === id);
};

export default useCategory;
