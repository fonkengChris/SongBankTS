import useImages from "./useImages";

const useImage = (id?: string | null) => {
  const { data: iamges } = useImages();
  return iamges!.find((c) => c._id === id);
};

export default useImage;
