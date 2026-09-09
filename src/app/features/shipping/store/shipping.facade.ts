import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import type { NormalizedAddress, ParcelSpec } from '../../../core/models';
import { ShippingActions } from './shipping.actions';
import type { PartyField } from './shipping.state';
import { defaultParcelSpec } from './shipping.state';
import {
  selectCanConfirm,
  selectCanGoToService,
  selectCreatedShipment,
  selectCreating,
  selectIsRecipientComplete,
  selectIsSenderComplete,
  selectOffers,
  selectOffersStatus,
  selectParcelSpec,
  selectRecipient,
  selectSelectedOffer,
  selectSelectedOptionCodes,
  selectSelectedOptions,
  selectSender,
  selectShipments,
  selectShipmentsStatus,
  selectShipmentsSummary,
  selectRatesByService,
  selectRatesStatus,
  selectShippingError,
  selectStep,
  selectTotalPrice,
} from './shipping.selectors';

@Injectable({ providedIn: 'root' })
export class ShippingFacade {
  private readonly store = inject(Store);

  readonly step = toSignal(this.store.select(selectStep), { initialValue: 1 as const });
  readonly sender = toSignal(this.store.select(selectSender), { initialValue: null });
  readonly recipient = toSignal(this.store.select(selectRecipient), { initialValue: null });
  readonly parcel = toSignal(this.store.select(selectParcelSpec), {
    initialValue: defaultParcelSpec,
  });
  readonly offers = toSignal(this.store.select(selectOffers), { initialValue: [] });
  readonly offersStatus = toSignal(this.store.select(selectOffersStatus), {
    initialValue: 'idle' as const,
  });
  readonly selectedOffer = toSignal(this.store.select(selectSelectedOffer), { initialValue: null });
  readonly selectedOptionCodes = toSignal(this.store.select(selectSelectedOptionCodes), {
    initialValue: [],
  });
  readonly selectedOptions = toSignal(this.store.select(selectSelectedOptions), {
    initialValue: [],
  });
  readonly totalPrice = toSignal(this.store.select(selectTotalPrice), { initialValue: 0 });
  readonly senderComplete = toSignal(this.store.select(selectIsSenderComplete), {
    initialValue: false,
  });
  readonly recipientComplete = toSignal(this.store.select(selectIsRecipientComplete), {
    initialValue: false,
  });
  readonly canGoToService = toSignal(this.store.select(selectCanGoToService), {
    initialValue: false,
  });
  readonly canConfirm = toSignal(this.store.select(selectCanConfirm), { initialValue: false });
  readonly creating = toSignal(this.store.select(selectCreating), { initialValue: false });
  readonly created = toSignal(this.store.select(selectCreatedShipment), { initialValue: null });
  readonly shipments = toSignal(this.store.select(selectShipments), { initialValue: [] });
  readonly shipmentsStatus = toSignal(this.store.select(selectShipmentsStatus), {
    initialValue: 'idle' as const,
  });
  readonly summary = toSignal(this.store.select(selectShipmentsSummary), {
    initialValue: { total: 0, pending: 0, inProgress: 0, delivered: 0, revenue: 0 },
  });
  readonly ratesByService = toSignal(this.store.select(selectRatesByService), {
    initialValue: [],
  });
  readonly ratesStatus = toSignal(this.store.select(selectRatesStatus), {
    initialValue: 'idle' as const,
  });
  readonly error = toSignal(this.store.select(selectShippingError), { initialValue: null });

  goToStep(step: 1 | 2 | 3): void {
    this.store.dispatch(ShippingActions.goToStep({ step }));
  }

  resolveAddress(field: PartyField, suggestionId: string): void {
    this.store.dispatch(ShippingActions.resolveAddress({ field, suggestionId }));
  }

  setAddress(field: PartyField, address: NormalizedAddress): void {
    this.store.dispatch(ShippingActions.setAddress({ field, address }));
  }

  clearAddress(field: PartyField): void {
    this.store.dispatch(ShippingActions.clearAddress({ field }));
  }

  setContact(field: PartyField, contact: { fullName: string; phone: string; email?: string }): void {
    this.store.dispatch(ShippingActions.setContact({ field, contact }));
  }

  setParcel(parcel: ParcelSpec): void {
    this.store.dispatch(ShippingActions.setParcel({ parcel }));
  }

  loadOffers(): void {
    this.store.dispatch(ShippingActions.loadOffers());
  }

  selectService(code: string): void {
    this.store.dispatch(ShippingActions.selectService({ code }));
  }

  toggleOption(code: string): void {
    this.store.dispatch(ShippingActions.toggleOption({ code }));
  }

  createShipment(): void {
    this.store.dispatch(ShippingActions.createShipment());
  }

  loadShipments(): void {
    this.store.dispatch(ShippingActions.loadShipments());
  }

  loadRates(): void {
    this.store.dispatch(ShippingActions.loadRates());
  }

  resetDraft(): void {
    this.store.dispatch(ShippingActions.resetDraft());
  }
}
