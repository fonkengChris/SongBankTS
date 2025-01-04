import { useQuery } from "@tanstack/react-query";
import { CUSTOMERS_ENDPOINT } from "../data/constants";
import Customer from "../entities/Customer";
import APIClient from "../services/api-client";
import ms from "ms";

const apiClient = new APIClient<Customer>(CUSTOMERS_ENDPOINT);

const useCustomer = (userId: string) => {
  return useQuery<Customer | undefined, Error>({
    queryKey: ["customer", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      const customers = await apiClient.getAll();
      return customers.find((c) => c?.user?._id === userId);
    },
    enabled: !!userId, // Only run the query if userId is present
    staleTime: ms("24h"),
    cacheTime: 0,
  });
};

export default useCustomer;
