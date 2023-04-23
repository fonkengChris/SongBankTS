import useNotations from "./useNotations";

const useNotation = (id?: number) => {
  const { data: notations } = useNotations();
  return notations.find((n) => n.id === id);
};

export default useNotation;
