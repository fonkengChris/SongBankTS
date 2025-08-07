import { axiosInstance } from "./api-client";
import { PaymentResponse } from "../types/payment";

export interface CreatePaymentData {
  orderId: string;
  amount: number;
  description: string;
  status: "PENDING" | "COMPLETED" | "SAVED" | "APPROVED" | "VOIDED" | "PAYER_ACTION_REQUIRED";
  provider: "PAYPAL" | "MTN_MOMO";
  mediaFileId?: string;
  purchaseType?: "SONG" | "SUBSCRIPTION";
  transactionDetails?: {
    originalAmount?: number;
    originalCurrency?: string;
    convertedAmount?: number;
    convertedCurrency?: string;
    exchangeRate?: number;
  };
}

class PaymentService {
  async createPayment(paymentData: CreatePaymentData): Promise<PaymentResponse> {
    try {
      const response = await axiosInstance.post<PaymentResponse>("/api/payments/create", paymentData);
      return response.data;
    } catch (error: any) {
      console.error("Failed to create payment record:", error);
      throw new Error(error.response?.data?.error || "Failed to create payment record");
    }
  }

  async verifyPayment(orderId: string): Promise<PaymentResponse> {
    try {
      const response = await axiosInstance.get<PaymentResponse>(`/api/payments/verify/${orderId}`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to verify payment:", error);
      throw new Error(error.response?.data?.error || "Failed to verify payment");
    }
  }

  async getUserPurchases(): Promise<PaymentResponse[]> {
    try {
      const response = await axiosInstance.get<PaymentResponse[]>("/api/payments/purchases");
      return response.data;
    } catch (error: any) {
      console.error("Failed to get user purchases:", error);
      throw new Error(error.response?.data?.error || "Failed to get user purchases");
    }
  }
}

export default new PaymentService();
