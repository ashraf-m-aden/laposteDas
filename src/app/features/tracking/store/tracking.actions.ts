import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type { ApiError, Parcel, RecentTracking } from '../../../core/models';

export const TrackingActions = createActionGroup({
  source: 'Tracking',
  events: {
    Track: props<{ trackingNumber: string }>(),
    'Track Success': props<{ parcel: Parcel }>(),
    'Track Failure': props<{ trackingNumber: string; error: ApiError }>(),
    'Toggle Notifications': props<{ trackingNumber: string; enabled: boolean }>(),
    'Toggle Notifications Success': props<{ parcel: Parcel }>(),
    'Toggle Notifications Failure': props<{ error: ApiError }>(),
    'Restore Recent': props<{ recent: RecentTracking[] }>(),
    'Clear Recent': emptyProps(),
    Reset: emptyProps(),
  },
});
