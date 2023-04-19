import notations from "../data/notations";
// import useData from "./useData";

export interface Notation {
  id: number;
  title: string;
  slug: string;
}

const useNotations = () => ({ data: notations, error: false });
// const useNotations = () => useData<Notation>("/notations");

export default useNotations;
