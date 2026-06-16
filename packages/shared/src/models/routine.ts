import type { DayOfWeek, TimeWindow } from "../index.js";

/** Plain Routine document shape — detected habitual route pattern */
export interface IRoutine {
  _id: string;
  userId: string;
  partnerId: string;
  timeWindow: TimeWindow;
  days: DayOfWeek[];
  repetitionCount: number;
  geofenceRadiusMeters: number;
  isActive: boolean;
  lastTriggeredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
