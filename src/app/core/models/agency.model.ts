import type { NormalizedAddress } from './address.model';

export type AgencyServiceCode =
  | 'MAIL'
  | 'PARCEL'
  | 'ATM'
  | 'MONEY_TRANSFER'
  | 'PO_BOX'
  | 'PHILATELY';

export interface OpeningHours {
  day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
  open: string;
  close: string;
  closed: boolean;
}

/** Agence / point de service (6.11 a 6.13). */
export interface Agency {
  id: string;
  name: string;
  phone: string;
  address: NormalizedAddress;
  services: AgencyServiceCode[];
  openingHours: OpeningHours[];
  hasAtm: boolean;
  isOpenNow: boolean;
  distanceKm: number;
}

export interface AgencyFilters {
  query: string;
  service: AgencyServiceCode | null;
  openOnly: boolean;
  sortBy: 'distance' | 'name';
}
