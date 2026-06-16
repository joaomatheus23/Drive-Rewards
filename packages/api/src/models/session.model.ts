import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { IGpsPoint, ISession } from "@driven-rewards/shared";

/** Embedded GPS point subdocument (no separate collection) */
const gpsPointSchema = new Schema<IGpsPoint>(
  {
    /** Latitude in decimal degrees */
    lat: { type: Number, required: true, min: -90, max: 90 },
    /** Longitude in decimal degrees */
    lng: { type: Number, required: true, min: -180, max: 180 },
    /** Speed in m/s at time of recording */
    speed: { type: Number, min: 0 },
    /** Heading in degrees (0–360) */
    heading: { type: Number, min: 0, max: 360 },
    /** Timestamp when coordinate was captured */
    recordedAt: { type: Date, required: true, default: Date.now },
  },
  { _id: false },
);

/** Mongoose document interface for Session */
export interface SessionDocument
  extends Omit<ISession, "_id" | "userId">,
    Document {
  userId: mongoose.Types.ObjectId;
}

const sessionSchema = new Schema<SessionDocument>(
  {
    /** Driver who owns this session */
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    /** Total distance driven in this session (km) */
    km: { type: Number, default: 0, min: 0 },
    /** Points earned during this session */
    points: { type: Number, default: 0, min: 0 },
    /** Session start time */
    startedAt: { type: Date, required: true, default: Date.now, index: true },
    /** Session end time (null while active) */
    endedAt: { type: Date },
    /** Array of GPS coordinates recorded during the drive */
    gpsPoints: { type: [gpsPointSchema], default: [] },
    /** Whether session is currently being tracked */
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

/** Index for routine detection queries (sessions by user + time range) */
sessionSchema.index({ userId: 1, startedAt: -1 });
sessionSchema.index({ userId: 1, isActive: 1 });

/** Virtual: session duration in minutes */
sessionSchema.virtual("durationMinutes").get(function (this: SessionDocument) {
  if (!this.endedAt) return null;
  return Math.round((this.endedAt.getTime() - this.startedAt.getTime()) / 60_000);
});

/** Virtual: GPS point count */
sessionSchema.virtual("gpsPointCount").get(function (this: SessionDocument) {
  return this.gpsPoints.length;
});

export const Session: Model<SessionDocument> =
  mongoose.models.Session ?? mongoose.model<SessionDocument>("Session", sessionSchema);
