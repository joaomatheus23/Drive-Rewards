import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { ICoupon } from "@driven-rewards/shared";

/** Mongoose document interface for Coupon */
export interface CouponDocument
  extends Omit<ICoupon, "_id" | "partnerId">,
    Document {
  partnerId: mongoose.Types.ObjectId;
}

const couponSchema = new Schema<CouponDocument>(
  {
    /** Partner that owns this coupon */
    partnerId: {
      type: Schema.Types.ObjectId,
      ref: "Partner",
      required: true,
      index: true,
    },
    /** Short title shown in app (e.g. "20% off lunch") */
    title: { type: String, required: true, trim: true, maxlength: 100 },
    /** Longer description with terms */
    description: { type: String, trim: true, maxlength: 500 },
    /** Discount type: percentage, fixed amount, BOGO, or free item */
    type: {
      type: String,
      enum: ["percentage", "fixed", "bogo", "free_item"],
      required: true,
    },
    /** Discount value — meaning depends on type (% or cents) */
    value: { type: Number, required: true, min: 0 },
    /** Minimum purchase required to redeem (in cents) */
    minPurchase: { type: Number, min: 0, default: 0 },
    /** Hard expiry date — coupon becomes invalid after this */
    expiresAt: { type: Date, required: true, index: true },
    /** Maximum total redemptions allowed (0 = unlimited) */
    redemptionLimit: { type: Number, default: 0, min: 0 },
    /** Current redemption count */
    redemptionCount: { type: Number, default: 0, min: 0 },
    /** Whether coupon is currently offered to drivers */
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

/** Compound index for listing active coupons by partner */
couponSchema.index({ partnerId: 1, isActive: 1, expiresAt: 1 });

/** Virtual: remaining redemptions (null if unlimited) */
couponSchema.virtual("remainingRedemptions").get(function (this: CouponDocument) {
  if (this.redemptionLimit === 0) return null;
  return Math.max(0, this.redemptionLimit - this.redemptionCount);
});

/** Virtual: whether coupon can still be redeemed */
couponSchema.virtual("isRedeemable").get(function (this: CouponDocument) {
  if (!this.isActive) return false;
  if (this.expiresAt <= new Date()) return false;
  if (this.redemptionLimit > 0 && this.redemptionCount >= this.redemptionLimit) return false;
  return true;
});

export const Coupon: Model<CouponDocument> =
  mongoose.models.Coupon ?? mongoose.model<CouponDocument>("Coupon", couponSchema);
