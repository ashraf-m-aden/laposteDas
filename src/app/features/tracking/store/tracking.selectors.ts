import { createSelector } from '@ngrx/store';
import { trackingFeature } from './tracking.reducer';

export const selectParcel = trackingFeature.selectParcel;
export const selectTrackingStatus = trackingFeature.selectStatus;
export const selectTrackingError = trackingFeature.selectError;
export const selectNotFoundNumber = trackingFeature.selectNotFoundNumber;
export const selectRecentTrackings = trackingFeature.selectRecent;

export const selectIsTracking = createSelector(
  selectTrackingStatus,
  (status) => status === 'loading',
);

export const selectIsNotFound = createSelector(selectNotFoundNumber, (value) => !!value);

/** Événements du plus récent au plus ancien pour la timeline verticale. */
export const selectTimeline = createSelector(selectParcel, (parcel) =>
  parcel
    ? [...parcel.events].sort(
        (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
      )
    : [],
);

export const selectCurrentStep = createSelector(selectParcel, (parcel) => {
  const order = ['CREATED', 'SORTING_CENTER', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'];
  return parcel ? order.indexOf(parcel.status) + 1 : 0;
});

export const selectNotificationsEnabled = createSelector(
  selectParcel,
  (parcel) => parcel?.notificationsEnabled ?? false,
);
