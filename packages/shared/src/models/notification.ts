/** Plain Notification document shape — push notification log */
export interface INotification {
  _id: string;
  userId: string;
  routineId?: string;
  partnerId?: string;
  title: string;
  body: string;
  fcmMessageId?: string;
  sentAt: Date;
  openedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
