import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { IPartner } from "@driven-rewards/shared";
import { ROUTINE } from "@driven-rewards/utils";

/** Mongoose document interface for Partner */
export interface PartnerDocument extends Omit<IPartner, "_id" | "ownerId" | "staffIds">, Document {
  ownerId: mongoose.Types.ObjectId;
  staffIds: mongoose.Types.ObjectId[];
}

const addressSchema = new Schema(
  {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true, default: "Winnipeg" },
    province: { type: String, required: true, trim: true, default: "MB" },
    postalCode: { type: String, required: true, trim: true, uppercase: true },
    country: { type: String, required: true, trim: true, default: "CA" },
  },
  { _id: false },
);

const geofenceSchema = new Schema(
  {
    center: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    /** Radius in meters for Smart Routine proximity alerts */
    radiusMeters: {
      type: Number,
      default: ROUTINE.GEOFENCE_RADIUS_METERS,
      min: 100,
      max: 2000,
    },
  },
  { _id: false },
);

const partnerSchema = new Schema<PartnerDocument>(
  {
    /** Business display name */
    name: { type: String, required: true, trim: true, maxlength: 200 },
    /** URL-friendly identifier for public pages */
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    /** Contact email for billing and notifications */
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    address: { type: addressSchema, required: true },
    /** GeoJSON Point for map display and geofencing */
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator(v: number[]) {
            return v.length === 2;
          },
          message: "Location coordinates must be [longitude, latitude]",
        },
      },
    },
    /** Circular geofence used by Smart Routine engine */
    geofence: { type: geofenceSchema, required: true },
    /** Subscription tier — controls feature access and commission rates */
    plan: {
      type: String,
      enum: ["free", "basic", "premium", "enterprise"],
      default: "free",
      index: true,
    },
    /** Stripe customer ID for billing */
    stripeCustomerId: { type: String, select: false },
    /** Stripe subscription ID for recurring plan */
    stripeSubscriptionId: { type: String, select: false },
    /** Commission percentage charged per redemption (0–100) */
    commissionRate: { type: Number, default: 10, min: 0, max: 100 },
    /** User ID of the partner owner */
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    /** Staff user IDs with QR scanner access */
    staffIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    /** Whether partner is visible to drivers and eligible for routines */
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

/** 2dsphere index for geo queries (nearby partners, geofence checks) */
partnerSchema.index({ location: "2dsphere" });
partnerSchema.index({ "geofence.center": "2dsphere" });

/** Virtual: active coupon count */
partnerSchema.virtual("activeCoupons", {
  ref: "Coupon",
  localField: "_id",
  foreignField: "partnerId",
  match: { isActive: true, expiresAt: { $gt: new Date() } },
  count: true,
});

export const Partner: Model<PartnerDocument> =
  mongoose.models.Partner ?? mongoose.model<PartnerDocument>("Partner", partnerSchema);
