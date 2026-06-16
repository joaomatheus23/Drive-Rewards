import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { IPointsLedger } from "@driven-rewards/shared";

/** Mongoose document interface for PointsLedger */
export interface PointsLedgerDocument
  extends Omit<IPointsLedger, "_id" | "userId" | "reference">,
    Document {
  userId: mongoose.Types.ObjectId;
  reference?: {
    model: string;
    id: mongoose.Types.ObjectId;
  };
}

const referenceSchema = new Schema(
  {
    /** Mongoose model name of the source document */
    model: { type: String, required: true },
    /** ObjectId of the source document */
    id: { type: Schema.Types.ObjectId, required: true },
  },
  { _id: false },
);

const pointsLedgerSchema = new Schema<PointsLedgerDocument>(
  {
    /** Driver whose balance changed */
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    /** Reason for points change */
    type: {
      type: String,
      enum: ["session", "redemption", "bonus", "referral", "adjustment"],
      required: true,
      index: true,
    },
    /** Points added (positive) or deducted (negative) */
    amount: { type: Number, required: true },
    /** User's total points after this transaction */
    balanceAfter: { type: Number, required: true, min: 0 },
    /** Polymorphic reference to source document (Session, Redemption, etc.) */
    reference: { type: referenceSchema },
    /** Human-readable description for the driver */
    description: { type: String, trim: true, maxlength: 200 },
  },
  { timestamps: true },
);

/** Index for user points history pagination */
pointsLedgerSchema.index({ userId: 1, createdAt: -1 });

export const PointsLedger: Model<PointsLedgerDocument> =
  mongoose.models.PointsLedger ??
  mongoose.model<PointsLedgerDocument>("PointsLedger", pointsLedgerSchema);
