import type { NormalizedAddress } from './address.model';

export interface Party {
  fullName: string;
  phone: string;
  email?: string;
  address: NormalizedAddress;
}

export type ParcelKind = 'DOCUMENT' | 'PARCEL' | 'FRAGILE';

export interface ParcelSpec {
  kind: ParcelKind;
  weightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
}

export interface ServiceOption {
  code: string;
  label: string;
  price: number;
}

/** Prestation éligible calculée par le back-end (6.5). */
export interface ServiceOffer {
  code: string;
  label: string;
  description: string;
  deliveryDelayLabel: string;
  price: number;
  currency: string;
  available: boolean;
  unavailableReason?: string;
  options: ServiceOption[];
}

export interface QuoteRequest {
  originAddressId: string;
  destinationAddressId: string;
  parcel: ParcelSpec;
}

export interface ShipmentPayload {
  sender: Party;
  recipient: Party;
  parcel: ParcelSpec;
  serviceCode: string;
  optionCodes: string[];
}

export type ShipmentStatus = 'PENDING' | 'IN_PROGRESS' | 'DELIVERED' | 'CANCELLED';

/** Expédition créée (6.6 / 6.15). */
export interface Shipment {
  id: string;
  trackingNumber: string;
  sender: Party;
  recipient: Party;
  parcel: ParcelSpec;
  serviceLabel: string;
  optionLabels: string[];
  price: number;
  currency: string;
  status: ShipmentStatus;
  createdAt: string;
  pickupDate: string;
}

/** Grille tarifaire négociée d'un compte entreprise (6.16). */
export interface BusinessRate {
  serviceCode: string;
  serviceLabel: string;
  zone: string;
  weightUpToKg: number;
  publicPrice: number;
  negotiatedPrice: number;
  currency: string;
}
