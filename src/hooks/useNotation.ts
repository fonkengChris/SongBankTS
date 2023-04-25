import useNotations from "./useNotations";

const useNotation = (id?: number | null) => {
  const { data: notations } = useNotations();
  return notations.find((n) => n.id === id);
};

export default useNotation;
