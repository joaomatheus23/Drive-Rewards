import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { IUser } from "@driven-rewards/shared";

/** Mongoose document interface for User */
export interface UserDocument extends Omit<IUser, "_id">, Document {
  vehicleType?: IUser["vehicleType"];
  profilePhotoUrl?: string;
  refreshTokenExpiresAt?: Date;
}

const vehicleSchema = new Schema(
  {
    make: { type: String, trim: true },
    model: { type: String, trim: true },
    year: { type: Number, min: 1990, max: 2030 },
    licensePlate: { type: String, trim: true, uppercase: true },
  },
  { _id: false },
);

const userSchema = new Schema<UserDocument>(
  {
    /** Full display name */
    name: { type: String, required: true, trim: true, maxlength: 120 },
    /** Unique login email */
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    /** bcrypt hash — never returned in API responses */
    passwordHash: { type: String, required: true, select: false },
    /** Role determines app context after login */
    role: {
      type: String,
      enum: ["driver", "partner_owner", "partner_staff", "admin", "super_admin"],
      required: true,
      index: true,
    },
    /** Accumulated reward points */
    points: { type: Number, default: 0, min: 0 },
    /** Gamification tier derived from points */
    level: {
      type: String,
      enum: ["bronze", "silver", "gold", "platinum"],
      default: "bronze",
    },
    /** Driver vehicle info (optional until registration step 2) */
    vehicle: { type: vehicleSchema, default: undefined },
    /** Vehicle category selected during onboarding */
    vehicleType: {
      type: String,
      enum: ["car", "motorcycle", "bike", "van", "scooter", "walk"],
    },
    /** Profile photo URI / CDN URL */
    profilePhotoUrl: { type: String },
    /** Firebase Cloud Messaging device token for push notifications */
    fcmToken: { type: String, select: false },
    /** Hashed refresh token for JWT rotation */
    refreshTokenHash: { type: String, select: false },
    /** Refresh token expiry — rotated on each login */
    refreshTokenExpiresAt: { type: Date, select: false },
    /** Linked partner ID for partner_owner / partner_staff roles */
    partnerId: { type: Schema.Types.ObjectId, ref: "Partner", index: true },
    /** Soft-disable account without deletion */
    isActive: { type: Boolean, default: true, index: true },
    /** Last successful login timestamp */
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

/** Virtual: total redemptions count (populated on demand) */
userSchema.virtual("redemptionCount", {
  ref: "Redemption",
  localField: "_id",
  foreignField: "userId",
  count: true,
});

userSchema.set("toJSON", {
  virtuals: true,
  transform(_doc, ret) {
    const obj = ret as unknown as Record<string, unknown>;
    delete obj.passwordHash;
    delete obj.refreshTokenHash;
    delete obj.fcmToken;
    return obj;
  },
});

export const User: Model<UserDocument> =
  mongoose.models.User ?? mongoose.model<UserDocument>("User", userSchema);
