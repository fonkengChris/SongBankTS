export interface PaymentResponse {
  orderId: string;
  status: string;
  amount: number;
  description: string;
  createdAt: string;
  mediaFileId?: string;
  purchaseType?: "SONG" | "SUBSCRIPTION";
  provider?: "PAYPAL" | "MTN_MOMO";
  phoneNumber?: string;
  momoStatus?: string;
}

export interface PaymentRequest {
  orderId: string;
  status: string;
  amount: number;
  description: string;
}
