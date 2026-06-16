/** Plain Redemption document shape */
export interface IRedemption {
  _id: string;
  userId: string;
  couponId: string;
  partnerId: string;
  commissionAmount: number;
  stripeTransferId?: string;
  redeemedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
