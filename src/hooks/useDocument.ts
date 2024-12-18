import useDocuments from "./useDocuments";

const useDocument = (id?: string | null) => {
  const { data: documents } = useDocuments();
  return documents!.find((c) => c._id === id);
};

export default useDocument;
