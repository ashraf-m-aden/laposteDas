import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type { ApiError, AppNotification } from '../../../core/models';
import type { NotificationFilter } from './notification.state';

export const NotificationActions = createActionGroup({
  source: 'Notifications',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ notifications: AppNotification[] }>(),
    'Load Failure': props<{ error: ApiError }>(),
    'Set Filter': props<{ filter: NotificationFilter }>(),
    'Mark As Read': props<{ id: string }>(),
    'Mark As Read Success': props<{ notification: AppNotification }>(),
    'Mark All As Read': emptyProps(),
    'Mark All As Read Success': props<{ notifications: AppNotification[] }>(),
    'Mark Failure': props<{ error: ApiError }>(),
  },
});
