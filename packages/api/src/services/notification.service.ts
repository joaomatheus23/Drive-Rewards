import { ROUTINE } from "@driven-rewards/utils";

/**
 * FCM push notification service.
 * Sends proximity alerts ~5 min before driver reaches a routine partner.
 */
export class NotificationService {
  /** Send push notification to a driver via FCM */
  async sendProximityAlert(_params: {
    userId: string;
    routineId: string;
    partnerId: string;
    partnerName: string;
  }): Promise<void> {
    // TODO: lookup fcmToken, call FCM API, log to Notification model
    void ROUTINE.NOTIFICATION_LEAD_MINUTES;
  }
}

export const notificationService = new NotificationService();
