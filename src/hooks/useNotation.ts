import Notation from "../entities/Notation";
import useNotations from "./useNotations";

const useNotation = (id?: Notation | string | null) => {
  const { data: notations } = useNotations();
  return notations!.find((n) => n._id === id);
};

export default useNotation;
