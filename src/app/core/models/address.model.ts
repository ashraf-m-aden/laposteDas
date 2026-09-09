export type AddressStatus = 'VALIDATED' | 'UNVERIFIED' | 'NOT_FOUND' | 'OUT_OF_ZONE';

/** Adresse normalisée servie par le back-end postal (source : référentiel D.A.S). */
export interface NormalizedAddress {
  id: string;
  formatted: string;
  street: string;
  district: string;
  city: string;
  region: string;
  country: string;
  postalCode?: string;
  latitude: number;
  longitude: number;
  status: AddressStatus;
  /** Hiérarchie administrative (pays > région > ville > quartier). */
  hierarchy: string[];
}

export interface AddressSuggestion {
  id: string;
  label: string;
  city: string;
  region: string;
}

export type AddressBookKind = 'HOME' | 'WORK' | 'OTHER';

/** Entrée du carnet d'adresses (6.23) : toujours adossée à une adresse validée. */
export interface AddressBookEntry {
  id: string;
  contactName: string;
  phone: string;
  kind: AddressBookKind;
  isDefault: boolean;
  address: NormalizedAddress;
}

export interface AddressBookPayload {
  contactName: string;
  phone: string;
  kind: AddressBookKind;
  isDefault: boolean;
  addressId: string;
}
