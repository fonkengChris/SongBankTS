import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/api-client";
import Payment from "../entities/Payment";

const apiClient = new APIClient<Payment>("/api/payments");

const usePayments = () => {
  const query = useQuery<Payment[], Error>({
    queryKey: ["payments"],
    queryFn: () => apiClient.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    ...query,
    refetch: query.refetch,
  };
};

export default usePayments;
