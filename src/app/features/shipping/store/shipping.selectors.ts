import { createSelector } from '@ngrx/store';
import type { Party } from '../../../core/models';
import { shippingFeature } from './shipping.reducer';

export const selectStep = shippingFeature.selectStep;
export const selectSender = shippingFeature.selectSender;
export const selectRecipient = shippingFeature.selectRecipient;
export const selectParcelSpec = shippingFeature.selectParcel;
export const selectOffers = shippingFeature.selectOffers;
export const selectOffersStatus = shippingFeature.selectOffersStatus;
export const selectSelectedServiceCode = shippingFeature.selectSelectedServiceCode;
export const selectSelectedOptionCodes = shippingFeature.selectSelectedOptionCodes;
export const selectCreating = shippingFeature.selectCreating;
export const selectCreatedShipment = shippingFeature.selectCreated;
export const selectShipments = shippingFeature.selectShipments;
export const selectShipmentsStatus = shippingFeature.selectListStatus;
export const selectShippingError = shippingFeature.selectError;
export const selectRates = shippingFeature.selectRates;
export const selectRatesStatus = shippingFeature.selectRatesStatus;
export const selectResolvingField = shippingFeature.selectResolving;

/** Une partie est complète si contact renseigné ET adresse validée (section 8). */
function isPartyComplete(party: Party | null): boolean {
  return !!party?.fullName && !!party?.phone && party?.address?.status === 'VALIDATED';
}

export const selectIsSenderComplete = createSelector(selectSender, isPartyComplete);
export const selectIsRecipientComplete = createSelector(selectRecipient, isPartyComplete);

export const selectCanGoToService = createSelector(
  selectIsSenderComplete,
  selectIsRecipientComplete,
  (sender, recipient) => sender && recipient,
);

export const selectSelectedOffer = createSelector(
  selectOffers,
  selectSelectedServiceCode,
  (offers, code) => offers.find((offer) => offer.code === code) ?? null,
);

export const selectSelectedOptions = createSelector(
  selectSelectedOffer,
  selectSelectedOptionCodes,
  (offer, codes) => offer?.options.filter((option) => codes.includes(option.code)) ?? [],
);

export const selectTotalPrice = createSelector(
  selectSelectedOffer,
  selectSelectedOptions,
  (offer, options) =>
    offer ? offer.price + options.reduce((total, option) => total + option.price, 0) : 0,
);

export const selectCanConfirm = createSelector(
  selectCanGoToService,
  selectSelectedOffer,
  (partiesReady, offer) => partiesReady && !!offer && offer.available,
);

/** Synthèse du tableau de bord entreprise (6.15). */
export const selectShipmentsSummary = createSelector(selectShipments, (shipments) => ({
  total: shipments.length,
  pending: shipments.filter((item) => item.status === 'PENDING').length,
  inProgress: shipments.filter((item) => item.status === 'IN_PROGRESS').length,
  delivered: shipments.filter((item) => item.status === 'DELIVERED').length,
  revenue: shipments.reduce((total, item) => total + item.price, 0),
}));

/** Grille tarifaire regroupée par prestation, pour affichage en tableau. */
export const selectRatesByService = createSelector(selectRates, (rates) => {
  const groups = new Map<string, { label: string; rows: typeof rates }>();
  for (const rate of rates) {
    const group = groups.get(rate.serviceCode) ?? { label: rate.serviceLabel, rows: [] };
    group.rows = [...group.rows, rate];
    groups.set(rate.serviceCode, group);
  }
  return [...groups.entries()].map(([code, group]) => ({ code, ...group }));
});
