import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/api-client";
import Notation from "../entities/Notation";
import useNotations from "./useNotations";

const useNotation = (notationId: string | number | undefined) => {
  const { data: notations, error, isLoading } = useNotations();

  return {
    notation:
      notationId && notations
        ? notations.find((n) => n._id === notationId)
        : undefined,
    error,
    isLoading,
  };
};

export default useNotation;
