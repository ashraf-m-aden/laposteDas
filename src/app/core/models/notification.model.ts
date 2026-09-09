export type NotificationType = 'TRACKING' | 'PROMO' | 'SYSTEM';

/** Notification du centre de notifications (6.17). */
export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  link?: string;
}
