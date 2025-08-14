import { PaymentResponse } from "../types/payment";

/**
 * Check if a user has purchased a specific media file
 * @param mediaFileId - The ID of the media file to check
 * @param purchases - Array of user's completed purchases
 * @returns boolean indicating if the user has purchased the media file
 */
export const hasUserPurchased = (
  mediaFileId: string,
  purchases: PaymentResponse[]
): boolean => {
  if (!purchases || purchases.length === 0) return false;
  
  return purchases.some(
    (purchase) =>
      purchase.mediaFileId === mediaFileId &&
      purchase.status === "COMPLETED" &&
      purchase.purchaseType === "SONG"
  );
};

/**
 * Get all purchased media file IDs for a user
 * @param purchases - Array of user's completed purchases
 * @returns Array of media file IDs that the user has purchased
 */
export const getPurchasedMediaFileIds = (
  purchases: PaymentResponse[]
): string[] => {
  if (!purchases || purchases.length === 0) return [];
  
  return purchases
    .filter(
      (purchase) =>
        purchase.status === "COMPLETED" &&
        purchase.purchaseType === "SONG" &&
        purchase.mediaFileId
    )
    .map((purchase) => purchase.mediaFileId!)
    .filter((id) => id); // Remove any undefined values
};
