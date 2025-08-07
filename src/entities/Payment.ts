export default interface Payment {
  _id: string;
  userId: string;
  orderId: string;
  amount: number;
  description: string;
  status: "PENDING" | "COMPLETED" | "SAVED" | "APPROVED" | "VOIDED" | "PAYER_ACTION_REQUIRED";
  createdAt: string;
  updatedAt: string;
  paymentDetails?: {
    mediaFileId?: string;
    purchaseType?: "SONG" | "SUBSCRIPTION";
    provider?: "PAYPAL" | "MTN_MOMO";
    originalAmount?: number;
    originalCurrency?: string;
    convertedAmount?: number;
    convertedCurrency?: string;
    exchangeRate?: number;
  };
  // Populated user information
  user?: {
    _id: string;
    name: string;
    email: string;
  };
  // Populated media file information
  mediaFile?: {
    _id: string;
    title: string;
    filename: string;
  };
}
