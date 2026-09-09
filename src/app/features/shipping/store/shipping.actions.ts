import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type {
  ApiError,
  BusinessRate,
  NormalizedAddress,
  ParcelSpec,
  ServiceOffer,
  Shipment,
} from '../../../core/models';
import type { PartyField } from './shipping.state';

export const ShippingActions = createActionGroup({
  source: 'Shipping',
  events: {
    'Go To Step': props<{ step: 1 | 2 | 3 }>(),
    'Resolve Address': props<{ field: PartyField; suggestionId: string }>(),
    'Resolve Address Success': props<{ field: PartyField; address: NormalizedAddress }>(),
    'Resolve Address Failure': props<{ field: PartyField; error: ApiError }>(),
    'Set Address': props<{ field: PartyField; address: NormalizedAddress }>(),
    'Clear Address': props<{ field: PartyField }>(),
    'Set Contact': props<{
      field: PartyField;
      contact: { fullName: string; phone: string; email?: string };
    }>(),
    'Set Parcel': props<{ parcel: ParcelSpec }>(),
    'Load Offers': emptyProps(),
    'Load Offers Success': props<{ offers: ServiceOffer[] }>(),
    'Load Offers Failure': props<{ error: ApiError }>(),
    'Select Service': props<{ code: string }>(),
    'Toggle Option': props<{ code: string }>(),
    'Create Shipment': emptyProps(),
    'Create Shipment Success': props<{ shipment: Shipment }>(),
    'Create Shipment Failure': props<{ error: ApiError }>(),
    'Load Shipments': emptyProps(),
    'Load Shipments Success': props<{ shipments: Shipment[] }>(),
    'Load Shipments Failure': props<{ error: ApiError }>(),
    'Load Rates': emptyProps(),
    'Load Rates Success': props<{ rates: BusinessRate[] }>(),
    'Load Rates Failure': props<{ error: ApiError }>(),
    'Reset Draft': emptyProps(),
  },
});
