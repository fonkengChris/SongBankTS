import { useState, useEffect, useCallback } from "react";
import { axiosInstance } from "../services/api-client";

interface MoMoPaymentStatus {
  status: string;
  referenceId: string;
  details?: any;
  updatedAt?: string;
}

interface UseMoMoPaymentReturn {
  paymentStatus: string | null;
  referenceId: string | null;
  isPolling: boolean;
  startPayment: (amount: number, description: string, phoneNumber: string, mediaFileId?: string) => Promise<void>;
  checkStatus: (refId: string) => Promise<void>;
  stopPolling: () => void;
  reset: () => void;
}

const useMoMoPayment = (onSuccess?: () => void): UseMoMoPaymentReturn => {
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  // Function to check payment status
  const checkStatus = useCallback(async (refId: string) => {
    try {
      const response = await axiosInstance.get<MoMoPaymentStatus>(`/api/momo/status/${refId}`);
      const status = response.data.status;
      
      setPaymentStatus(status);
      
      if (status === "SUCCESSFUL") {
        // Payment completed successfully
        stopPolling();
        if (onSuccess) onSuccess();
      } else if (status === "FAILED" || status === "TIMEOUT") {
        // Payment failed
        stopPolling();
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
    }
  }, [onSuccess]);

  // Function to start status polling
  const startPolling = useCallback((refId: string) => {
    // Check immediately
    checkStatus(refId);
    
    // Then check every 10 seconds
    const interval = setInterval(() => {
      checkStatus(refId);
    }, 10000);
    
    setPollingInterval(interval);
    setIsPolling(true);
  }, [checkStatus]);

  // Function to stop polling
  const stopPolling = useCallback(() => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
    setIsPolling(false);
  }, [pollingInterval]);

  // Function to start payment
  const startPayment = useCallback(async (
    amount: number, 
    description: string, 
    phoneNumber: string, 
    mediaFileId?: string
  ) => {
    try {
      const payload = {
        amount,
        description,
        phoneNumber,
        mediaFileId,
      };

      const response = await axiosInstance.post("/api/momo/payment", payload);

      if (response.data.status === "PENDING") {
        const refId = response.data.referenceId;
        setReferenceId(refId);
        setPaymentStatus("PENDING");
        
        // Start polling for status updates
        startPolling(refId);
        
        return;
      }
      
      throw new Error("Failed to initiate payment");
    } catch (error) {
      console.error("Payment initiation error:", error);
      throw error;
    }
  }, [startPolling]);

  // Function to reset the hook state
  const reset = useCallback(() => {
    stopPolling();
    setPaymentStatus(null);
    setReferenceId(null);
  }, [stopPolling]);

  return {
    paymentStatus,
    referenceId,
    isPolling,
    startPayment,
    checkStatus,
    stopPolling,
    reset,
  };
};

export default useMoMoPayment;
