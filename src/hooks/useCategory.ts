import useCategories from "./useCategories";

const useCategory = (id?: number) => {
  const { data: categories } = useCategories();
  return categories.find((c) => c.id === id);
};

export default useCategory;
