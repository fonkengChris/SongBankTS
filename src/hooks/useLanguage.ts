import useLanguages from "./useLanguages";

const useLanguage = (id?: number | null) => {
  const { data: languages } = useLanguages();
  return languages.find((l) => l.id === id);
};

export default useLanguage;
