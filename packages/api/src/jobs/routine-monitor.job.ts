import { ROUTINE } from "@driven-rewards/utils";
import { isInsideGeofence } from "@driven-rewards/utils";
import { Routine, Partner } from "../models/index.js";
import { notificationService } from "../services/notification.service.js";

/**
 * Background job: monitors active routines against incoming GPS points.
 * Triggered when mobile app posts GPS batch to /sessions/:id/gps.
 * Sends FCM push ~5 min before estimated partner arrival.
 */
export class RoutineMonitorJob {
  async evaluateProximity(
    userId: string,
    lat: number,
    lng: number,
    currentMinutes: number,
    dayOfWeek: number,
  ): Promise<void> {
    const routines = await Routine.find({
      userId,
      isActive: true,
      days: dayOfWeek,
      "timeWindow.startMinutes": {
        $gte: currentMinutes - ROUTINE.TIME_TOLERANCE_MINUTES - ROUTINE.NOTIFICATION_LEAD_MINUTES,
        $lte: currentMinutes + ROUTINE.TIME_TOLERANCE_MINUTES,
      },
    }).populate("partnerId");

    for (const routine of routines) {
      const partner = await Partner.findById(routine.partnerId);
      if (!partner) continue;

      const [lngP, latP] = partner.location.coordinates;
      const inside = isInsideGeofence(
        lat,
        lng,
        latP,
        lngP,
        routine.geofenceRadiusMeters,
      );

      if (inside && !this.recentlyTriggered(routine.lastTriggeredAt)) {
        await notificationService.sendProximityAlert({
          userId,
          routineId: routine._id.toString(),
          partnerId: partner._id.toString(),
          partnerName: partner.name,
        });
        routine.lastTriggeredAt = new Date();
        await routine.save();
      }
    }
  }

  private recentlyTriggered(lastTriggeredAt?: Date): boolean {
    if (!lastTriggeredAt) return false;
    const cooldownMs = 30 * 60 * 1000; // 30 min cooldown per routine
    return Date.now() - lastTriggeredAt.getTime() < cooldownMs;
  }
}

export const routineMonitorJob = new RoutineMonitorJob();
