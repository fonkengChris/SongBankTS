import { useQuery } from "@tanstack/react-query";
import paymentService from "../services/payment-service";
import { PaymentResponse } from "../types/payment";

const usePurchases = () => {
  return useQuery<PaymentResponse[], Error>({
    queryKey: ["purchases"],
    queryFn: () => paymentService.getUserPurchases(),
    enabled: !!localStorage.getItem("token"), // Only fetch if user is authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export default usePurchases;
