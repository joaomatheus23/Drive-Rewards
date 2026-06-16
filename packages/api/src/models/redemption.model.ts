import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { IRedemption } from "@driven-rewards/shared";

/** Mongoose document interface for Redemption */
export interface RedemptionDocument
  extends Omit<IRedemption, "_id" | "userId" | "couponId" | "partnerId">,
    Document {
  userId: mongoose.Types.ObjectId;
  couponId: mongoose.Types.ObjectId;
  partnerId: mongoose.Types.ObjectId;
}

const redemptionSchema = new Schema<RedemptionDocument>(
  {
    /** Driver who redeemed the coupon */
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    /** Coupon that was redeemed */
    couponId: { type: Schema.Types.ObjectId, ref: "Coupon", required: true, index: true },
    /** Partner where redemption occurred */
    partnerId: { type: Schema.Types.ObjectId, ref: "Partner", required: true, index: true },
    /** Commission amount charged to partner (in cents) */
    commissionAmount: { type: Number, required: true, min: 0 },
    /** Stripe transfer ID for commission payout tracking */
    stripeTransferId: { type: String },
    /** Timestamp when driver scanned/redeemed at partner */
    redeemedAt: { type: Date, required: true, default: Date.now, index: true },
  },
  { timestamps: true },
);

/** Compound indexes for reporting queries */
redemptionSchema.index({ partnerId: 1, redeemedAt: -1 });
redemptionSchema.index({ userId: 1, redeemedAt: -1 });

export const Redemption: Model<RedemptionDocument> =
  mongoose.models.Redemption ??
  mongoose.model<RedemptionDocument>("Redemption", redemptionSchema);
