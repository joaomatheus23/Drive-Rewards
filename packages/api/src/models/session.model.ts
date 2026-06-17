/**
 * Session Mongoose model
 * Role: api
 * Entry: session persistence layer
 * Exit: typed Session documents for queries and mutations
 */
import mongoose, { Schema, type Document, type Model } from "mongoose";
import type {
  IGpsPoint,
  ISession,
  ISessionVehicleSnapshot,
  SessionPlatform,
  SessionStatus,
  TripPurpose,
} from "@driven-rewards/shared";

const gpsPointSchema = new Schema<IGpsPoint>(
  {
    lat: { type: Number, required: true, min: -90, max: 90 },
    lng: { type: Number, required: true, min: -180, max: 180 },
    speed: { type: Number, min: 0 },
    accuracy: { type: Number, min: 0 },
    heading: { type: Number, min: 0, max: 360 },
    altitude: { type: Number },
    recordedAt: { type: Date, required: true, default: Date.now },
  },
  { _id: false },
);

const vehicleSnapshotSchema = new Schema<ISessionVehicleSnapshot>(
  {
    vehicleType: { type: String },
    licensePlate: { type: String },
    fuelConsumptionL100km: { type: Number, required: true, min: 1 },
    depreciationRatePerKm: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

export interface SessionDocument
  extends Omit<ISession, "_id" | "userId">,
    Document {
  userId: mongoose.Types.ObjectId;
}

const sessionSchema = new Schema<SessionDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    status: {
      type: String,
      enum: ["active", "paused", "completed"],
      default: "active",
      index: true,
    },
    platform: {
      type: String,
      enum: ["uber", "lyft", "doordash", "skip", "ubereats", "manual"],
    },
    startedAt: { type: Date, required: true, default: Date.now, index: true },
    endedAt: { type: Date },
    gpsPoints: { type: [gpsPointSchema], default: [] },
    distanceKm: { type: Number, default: 0, min: 0 },
    durationMinutes: { type: Number, default: 0, min: 0 },
    grossEarnings: { type: Number, default: 0, min: 0 },
    fuelCostCAD: { type: Number, default: 0, min: 0 },
    depreciationCostCAD: { type: Number, default: 0, min: 0 },
    netProfitCAD: { type: Number, default: 0 },
    profitPerKm: { type: Number, default: 0 },
    profitPerHour: { type: Number, default: 0 },
    pointsEarned: { type: Number, default: 0, min: 0 },
    deviceId: { type: String, required: true, trim: true },
    tripHash: { type: String, required: true, index: true },
    isDriver: { type: Boolean, default: true },
    fraudFlags: { type: [String], default: [] },
    tripPurpose: {
      type: String,
      enum: ["work", "personal", "mixed"],
    },
    craEligibleKm: { type: Number, default: 0, min: 0 },
    vehicleSnapshot: { type: vehicleSnapshotSchema, required: true },
    isActive: { type: Boolean, default: true, index: true },
    km: { type: Number, default: 0, min: 0 },
    points: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

sessionSchema.index({ userId: 1, startedAt: -1 });
sessionSchema.index({ userId: 1, status: 1 });
sessionSchema.index({ tripHash: 1 }, { unique: true, sparse: true });

sessionSchema.virtual("gpsPointCount").get(function (this: SessionDocument) {
  return this.gpsPoints.length;
});

export const Session: Model<SessionDocument> =
  mongoose.models.Session ?? mongoose.model<SessionDocument>("Session", sessionSchema);
