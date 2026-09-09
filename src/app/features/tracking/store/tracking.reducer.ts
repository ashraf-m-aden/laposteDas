import { createFeature, createReducer, on } from '@ngrx/store';
import { TrackingActions } from './tracking.actions';
import { TRACKING_FEATURE_KEY, initialTrackingState } from './tracking.state';

export const trackingFeature = createFeature({
  name: TRACKING_FEATURE_KEY,
  reducer: createReducer(
    initialTrackingState,
    on(TrackingActions.track, (state) => ({
      ...state,
      status: 'loading' as const,
      error: null,
      notFoundNumber: null,
    })),
    on(TrackingActions.trackSuccess, (state, { parcel }) => ({
      ...state,
      parcel,
      status: 'loaded' as const,
      error: null,
      notFoundNumber: null,
      recent: [
        {
          trackingNumber: parcel.trackingNumber,
          searchedAt: new Date().toISOString(),
          status: parcel.status,
        },
        ...state.recent.filter((item) => item.trackingNumber !== parcel.trackingNumber),
      ].slice(0, 5),
    })),
    on(TrackingActions.trackFailure, (state, { trackingNumber, error }) => ({
      ...state,
      parcel: null,
      status: 'error' as const,
      error,
      notFoundNumber: error.code === 'PARCEL_NOT_FOUND' ? trackingNumber : null,
    })),
    on(TrackingActions.toggleNotificationsSuccess, (state, { parcel }) => ({
      ...state,
      parcel,
    })),
    on(TrackingActions.restoreRecent, (state, { recent }) => ({ ...state, recent })),
    on(TrackingActions.clearRecent, (state) => ({ ...state, recent: [] })),
    on(TrackingActions.reset, () => initialTrackingState),
  ),
});
