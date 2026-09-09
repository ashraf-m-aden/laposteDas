import type { ApiError, Parcel, RecentTracking, ViewStatus } from '../../../core/models';

export const TRACKING_FEATURE_KEY = 'tracking';

export interface TrackingState {
  parcel: Parcel | null;
  status: ViewStatus;
  error: ApiError | null;
  /** Numéro recherché sans résultat -> écran "colis introuvable" (6.3). */
  notFoundNumber: string | null;
  recent: RecentTracking[];
}

export const initialTrackingState: TrackingState = {
  parcel: null,
  status: 'idle',
  error: null,
  notFoundNumber: null,
  recent: [],
};
