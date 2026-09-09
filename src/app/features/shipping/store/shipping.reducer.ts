import { createFeature, createReducer, on } from '@ngrx/store';
import type { Party } from '../../../core/models';
import { ShippingActions } from './shipping.actions';
import { SHIPPING_FEATURE_KEY, initialShippingState } from './shipping.state';

/** Fusionne une adresse ou un contact dans la partie expéditeur/destinataire. */
function mergeParty(party: Party | null, patch: Partial<Party>): Party {
  return {
    fullName: patch.fullName ?? party?.fullName ?? '',
    phone: patch.phone ?? party?.phone ?? '',
    email: patch.email ?? party?.email,
    address: patch.address ?? (party?.address as Party['address']),
  };
}

export const shippingFeature = createFeature({
  name: SHIPPING_FEATURE_KEY,
  reducer: createReducer(
    initialShippingState,
    on(ShippingActions.goToStep, (state, { step }) => ({ ...state, step })),
    on(ShippingActions.resolveAddress, (state, { field }) => ({ ...state, resolving: field })),
    on(
      ShippingActions.resolveAddressSuccess,
      ShippingActions.setAddress,
      (state, { field, address }) => ({
        ...state,
        resolving: null,
        [field]: mergeParty(state[field], { address }),
        // Une adresse modifiée invalide la tarification déjà calculée.
        offers: [],
        offersStatus: 'idle' as const,
        selectedServiceCode: null,
        selectedOptionCodes: [],
      }),
    ),
    on(ShippingActions.resolveAddressFailure, (state, { error }) => ({
      ...state,
      resolving: null,
      error,
    })),
    on(ShippingActions.clearAddress, (state, { field }) => ({
      ...state,
      [field]: null,
      offers: [],
      offersStatus: 'idle' as const,
      selectedServiceCode: null,
    })),
    on(ShippingActions.setContact, (state, { field, contact }) => ({
      ...state,
      [field]: mergeParty(state[field], contact),
    })),
    on(ShippingActions.setParcel, (state, { parcel }) => ({
      ...state,
      parcel,
      offers: [],
      offersStatus: 'idle' as const,
      selectedServiceCode: null,
      selectedOptionCodes: [],
    })),
    on(ShippingActions.loadOffers, (state) => ({
      ...state,
      offersStatus: 'loading' as const,
      error: null,
    })),
    on(ShippingActions.loadOffersSuccess, (state, { offers }) => ({
      ...state,
      offers,
      offersStatus: offers.length ? ('loaded' as const) : ('empty' as const),
    })),
    on(ShippingActions.loadOffersFailure, (state, { error }) => ({
      ...state,
      offersStatus: 'error' as const,
      error,
    })),
    on(ShippingActions.selectService, (state, { code }) => ({
      ...state,
      selectedServiceCode: code,
      selectedOptionCodes: [],
    })),
    on(ShippingActions.toggleOption, (state, { code }) => ({
      ...state,
      selectedOptionCodes: state.selectedOptionCodes.includes(code)
        ? state.selectedOptionCodes.filter((item) => item !== code)
        : [...state.selectedOptionCodes, code],
    })),
    on(ShippingActions.createShipment, (state) => ({ ...state, creating: true, error: null })),
    on(ShippingActions.createShipmentSuccess, (state, { shipment }) => ({
      ...state,
      creating: false,
      created: shipment,
      shipments: [shipment, ...state.shipments],
    })),
    on(ShippingActions.createShipmentFailure, (state, { error }) => ({
      ...state,
      creating: false,
      error,
    })),
    on(ShippingActions.loadShipments, (state) => ({ ...state, listStatus: 'loading' as const })),
    on(ShippingActions.loadShipmentsSuccess, (state, { shipments }) => ({
      ...state,
      shipments,
      listStatus: shipments.length ? ('loaded' as const) : ('empty' as const),
    })),
    on(ShippingActions.loadShipmentsFailure, (state, { error }) => ({
      ...state,
      listStatus: 'error' as const,
      error,
    })),
    on(ShippingActions.loadRates, (state) => ({ ...state, ratesStatus: 'loading' as const })),
    on(ShippingActions.loadRatesSuccess, (state, { rates }) => ({
      ...state,
      rates,
      ratesStatus: rates.length ? ('loaded' as const) : ('empty' as const),
    })),
    on(ShippingActions.loadRatesFailure, (state, { error }) => ({
      ...state,
      ratesStatus: 'error' as const,
      error,
    })),
    on(ShippingActions.resetDraft, (state) => ({
      ...initialShippingState,
      shipments: state.shipments,
      listStatus: state.listStatus,
      rates: state.rates,
      ratesStatus: state.ratesStatus,
    })),
  ),
});
