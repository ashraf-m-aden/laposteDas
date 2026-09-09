import { createSelector } from '@ngrx/store';
import { notificationFeature } from './notification.reducer';
import { notificationAdapter } from './notification.state';

const { selectAll } = notificationAdapter.getSelectors();

export const selectNotificationState = notificationFeature.selectNotificationsState;
export const selectNotificationStatus = notificationFeature.selectStatus;
export const selectNotificationFilter = notificationFeature.selectFilter;
export const selectNotificationError = notificationFeature.selectError;

export const selectAllNotifications = createSelector(selectNotificationState, selectAll);

export const selectUnreadCount = createSelector(
  selectAllNotifications,
  (notifications) => notifications.filter((item) => !item.read).length,
);

export const selectVisibleNotifications = createSelector(
  selectAllNotifications,
  selectNotificationFilter,
  (notifications, filter) => {
    if (filter === 'UNREAD') {
      return notifications.filter((item) => !item.read);
    }
    if (filter === 'READ') {
      return notifications.filter((item) => item.read);
    }
    return notifications;
  },
);

/** Statut affiché : tient compte du filtre (une liste filtrée vide reste "empty"). */
export const selectDisplayStatus = createSelector(
  selectNotificationStatus,
  selectVisibleNotifications,
  (status, visible) => (status === 'loaded' && !visible.length ? ('empty' as const) : status),
);
