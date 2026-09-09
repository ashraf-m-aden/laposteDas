import type { NormalizedAddress } from './address.model';

export type ParcelStatus =
  | 'CREATED'
  | 'IN_TRANSIT'
  | 'SORTING_CENTER'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'EXCEPTION';

export interface TrackingEvent {
  id: string;
  status: ParcelStatus;
  label: string;
  location: string;
  occurredAt: string;
  comment?: string;
}

/** Colis suivi (6.3). */
export interface Parcel {
  trackingNumber: string;
  status: ParcelStatus;
  serviceLabel: string;
  weightKg: number;
  origin: NormalizedAddress;
  destination: NormalizedAddress;
  estimatedDeliveryDate: string;
  notificationsEnabled: boolean;
  events: TrackingEvent[];
}

export interface RecentTracking {
  trackingNumber: string;
  searchedAt: string;
  status: ParcelStatus;
}
