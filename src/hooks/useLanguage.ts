import useLanguages from "./useLanguages";

const useLanguage = (id?: string | null) => {
  const { data: languages } = useLanguages();
  return languages!.find((l) => l._id === id);
};

export default useLanguage;
