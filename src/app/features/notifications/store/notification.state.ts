import { EntityState, createEntityAdapter } from '@ngrx/entity';
import type { ApiError, AppNotification, ViewStatus } from '../../../core/models';

export const NOTIFICATION_FEATURE_KEY = 'notifications';

export type NotificationFilter = 'ALL' | 'UNREAD' | 'READ';

export interface NotificationState extends EntityState<AppNotification> {
  status: ViewStatus;
  filter: NotificationFilter;
  error: ApiError | null;
}

export const notificationAdapter = createEntityAdapter<AppNotification>({
  selectId: (notification) => notification.id,
  sortComparer: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
});

export const initialNotificationState: NotificationState = notificationAdapter.getInitialState({
  status: 'idle' as ViewStatus,
  filter: 'ALL' as NotificationFilter,
  error: null,
});
