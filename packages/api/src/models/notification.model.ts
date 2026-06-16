import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { INotification } from "@driven-rewards/shared";

/** Mongoose document interface for Notification */
export interface NotificationDocument
  extends Omit<INotification, "_id" | "userId" | "routineId" | "partnerId">,
    Document {
  userId: mongoose.Types.ObjectId;
  routineId?: mongoose.Types.ObjectId;
  partnerId?: mongoose.Types.ObjectId;
}

const notificationSchema = new Schema<NotificationDocument>(
  {
    /** Recipient driver */
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    /** Routine that triggered this notification (Smart Routine) */
    routineId: { type: Schema.Types.ObjectId, ref: "Routine", index: true },
    /** Partner referenced in the notification */
    partnerId: { type: Schema.Types.ObjectId, ref: "Partner", index: true },
    /** Push notification title */
    title: { type: String, required: true, trim: true, maxlength: 100 },
    /** Push notification body text */
    body: { type: String, required: true, trim: true, maxlength: 300 },
    /** FCM message ID returned by Firebase */
    fcmMessageId: { type: String },
    /** When notification was sent via FCM */
    sentAt: { type: Date, required: true, default: Date.now, index: true },
    /** When user opened/tapped the notification (null = not opened) */
    openedAt: { type: Date },
  },
  { timestamps: true },
);

/** Index for notification analytics */
notificationSchema.index({ userId: 1, sentAt: -1 });
notificationSchema.index({ routineId: 1, sentAt: -1 });

/** Virtual: whether notification was opened */
notificationSchema.virtual("wasOpened").get(function (this: NotificationDocument) {
  return this.openedAt != null;
});

export const Notification: Model<NotificationDocument> =
  mongoose.models.Notification ??
  mongoose.model<NotificationDocument>("Notification", notificationSchema);
