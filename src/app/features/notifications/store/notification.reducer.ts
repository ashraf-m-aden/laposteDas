import { createFeature, createReducer, on } from '@ngrx/store';
import { NotificationActions } from './notification.actions';
import {
  NOTIFICATION_FEATURE_KEY,
  initialNotificationState,
  notificationAdapter,
} from './notification.state';

export const notificationFeature = createFeature({
  name: NOTIFICATION_FEATURE_KEY,
  reducer: createReducer(
    initialNotificationState,
    on(NotificationActions.load, (state) => ({ ...state, status: 'loading' as const })),
    on(NotificationActions.loadSuccess, (state, { notifications }) =>
      notificationAdapter.setAll(notifications, {
        ...state,
        status: notifications.length ? ('loaded' as const) : ('empty' as const),
      }),
    ),
    on(NotificationActions.loadFailure, (state, { error }) => ({
      ...state,
      status: 'error' as const,
      error,
    })),
    on(NotificationActions.setFilter, (state, { filter }) => ({ ...state, filter })),
    on(NotificationActions.markAsReadSuccess, (state, { notification }) =>
      notificationAdapter.upsertOne(notification, state),
    ),
    on(NotificationActions.markAllAsReadSuccess, (state, { notifications }) =>
      notificationAdapter.setAll(notifications, state),
    ),
    on(NotificationActions.markFailure, (state, { error }) => ({ ...state, error })),
  ),
});
