export interface PaymentResponse {
  orderId: string;
  status: string;
  amount: number;
  description: string;
  createdAt: string;
}

export interface PaymentRequest {
  orderId: string;
  status: string;
  amount: number;
  description: string;
}
