import type { CouponType } from "../index.js";

/** Plain Coupon document shape */
export interface ICoupon {
  _id: string;
  partnerId: string;
  title: string;
  description?: string;
  type: CouponType;
  value: number;
  minPurchase?: number;
  expiresAt: Date;
  redemptionLimit: number;
  redemptionCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
