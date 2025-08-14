import { useState } from "react";
import APIClient from "../services/api-client";
import Payment from "../entities/Payment";

const useDeletePayment = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deletePayment = async (paymentId: string): Promise<boolean> => {
    setIsDeleting(true);
    setError(null);

    try {
      const apiClient = new APIClient<Payment>("/api/payments");
      const response = await apiClient.delete(paymentId);
      
      if (response.status === 200) {
        return true;
      } else {
        setError("Failed to delete payment");
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || "Failed to delete payment";
      setError(errorMessage);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deletePayment,
    isDeleting,
    error,
    clearError: () => setError(null),
  };
};

export default useDeletePayment;
