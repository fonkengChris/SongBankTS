import useData from "./useData";

export interface Notation {
  id: number;
  title: string;
  slug: string;
}

const useNotations = () => useData<Notation>("/notations");

export default useNotations;
