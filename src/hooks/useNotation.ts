import useNotations from "./useNotations";

const useNotation = (id?: string | null) => {
  const { data: notations } = useNotations();
  return notations!.find((n) => n._id === id);
};

export default useNotation;
