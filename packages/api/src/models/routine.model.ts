import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { IRoutine } from "@driven-rewards/shared";
import { ROUTINE } from "@driven-rewards/utils";

/** Mongoose document interface for Routine */
export interface RoutineDocument
  extends Omit<IRoutine, "_id" | "userId" | "partnerId">,
    Document {
  userId: mongoose.Types.ObjectId;
  partnerId: mongoose.Types.ObjectId;
}

const timeWindowSchema = new Schema(
  {
    /** Start of habitual time window (minutes from midnight, e.g. 480 = 08:00) */
    startMinutes: { type: Number, required: true, min: 0, max: 1439 },
    /** End of habitual time window (minutes from midnight) */
    endMinutes: { type: Number, required: true, min: 0, max: 1439 },
  },
  { _id: false },
);

const routineSchema = new Schema<RoutineDocument>(
  {
    /** Driver whose route pattern was detected */
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    /** Partner near the detected route */
    partnerId: { type: Schema.Types.ObjectId, ref: "Partner", required: true, index: true },
    /** Detected time window (±20 min tolerance applied during detection) */
    timeWindow: { type: timeWindowSchema, required: true },
    /** Days of week when pattern occurs (0=Sun … 6=Sat) */
    days: {
      type: [Number],
      required: true,
      validate: {
        validator(v: number[]) {
          return v.length > 0 && v.every((d) => d >= 0 && d <= 6);
        },
        message: "Days must be array of 0–6",
      },
    },
    /** Number of repetitions that confirmed this pattern (min 3) */
    repetitionCount: {
      type: Number,
      default: ROUTINE.MIN_REPETITIONS,
      min: ROUTINE.MIN_REPETITIONS,
    },
    /** Geofence radius for proximity notification trigger */
    geofenceRadiusMeters: {
      type: Number,
      default: ROUTINE.GEOFENCE_RADIUS_METERS,
    },
    /** Whether routine is actively monitored */
    isActive: { type: Boolean, default: true, index: true },
    /** Last time a notification was sent for this routine */
    lastTriggeredAt: { type: Date },
  },
  { timestamps: true },
);

/** Unique routine per user + partner + time window combo */
routineSchema.index({ userId: 1, partnerId: 1, "timeWindow.startMinutes": 1 });
routineSchema.index({ userId: 1, isActive: 1, days: 1 });

/** Virtual: human-readable time window string */
routineSchema.virtual("timeWindowLabel").get(function (this: RoutineDocument) {
  const fmt = (m: number) =>
    `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  return `${fmt(this.timeWindow.startMinutes)}–${fmt(this.timeWindow.endMinutes)}`;
});

export const Routine: Model<RoutineDocument> =
  mongoose.models.Routine ?? mongoose.model<RoutineDocument>("Routine", routineSchema);
