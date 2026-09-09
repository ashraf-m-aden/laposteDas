import type {
  ApiError,
  BusinessRate,
  Party,
  ParcelSpec,
  ServiceOffer,
  Shipment,
  ViewStatus,
} from '../../../core/models';

export const SHIPPING_FEATURE_KEY = 'shipping';

export type PartyField = 'sender' | 'recipient';

export interface ShippingState {
  /** Étape du parcours : 1 adresses, 2 prestation, 3 récapitulatif. */
  step: 1 | 2 | 3;
  sender: Party | null;
  recipient: Party | null;
  parcel: ParcelSpec;
  resolving: PartyField | null;
  offers: ServiceOffer[];
  offersStatus: ViewStatus;
  selectedServiceCode: string | null;
  selectedOptionCodes: string[];
  creating: boolean;
  created: Shipment | null;
  shipments: Shipment[];
  listStatus: ViewStatus;
  rates: BusinessRate[];
  ratesStatus: ViewStatus;
  error: ApiError | null;
}

export const defaultParcelSpec: ParcelSpec = {
  kind: 'PARCEL',
  weightKg: 1,
  lengthCm: 30,
  widthCm: 20,
  heightCm: 10,
};

export const initialShippingState: ShippingState = {
  step: 1,
  sender: null,
  recipient: null,
  parcel: defaultParcelSpec,
  resolving: null,
  offers: [],
  offersStatus: 'idle',
  selectedServiceCode: null,
  selectedOptionCodes: [],
  creating: false,
  created: null,
  shipments: [],
  listStatus: 'idle',
  rates: [],
  ratesStatus: 'idle',
  error: null,
};
