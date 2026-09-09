import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, filter, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { AddressApi, ShippingApi } from '../../../core/api/api.contracts';
import type { ApiError, ShipmentPayload } from '../../../core/models';
import { ToastActions } from '../../../store/toast/toast.actions';
import { ShippingActions } from './shipping.actions';
import {
  selectCanGoToService,
  selectParcelSpec,
  selectRecipient,
  selectSelectedOptionCodes,
  selectSelectedServiceCode,
  selectSender,
} from './shipping.selectors';

@Injectable()
export class ShippingEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly api = inject(ShippingApi);
  private readonly addressApi = inject(AddressApi);
  private readonly router = inject(Router);

  /** Résolution de la suggestion en adresse normalisée (validation bloquante, 6.4). */
  readonly resolveAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShippingActions.resolveAddress),
      switchMap(({ field, suggestionId }) =>
        this.addressApi.getById(suggestionId).pipe(
          map((address) => ShippingActions.resolveAddressSuccess({ field, address })),
          catchError((error: ApiError) =>
            of(ShippingActions.resolveAddressFailure({ field, error })),
          ),
        ),
      ),
    ),
  );

  readonly warnAddressNotUsable$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShippingActions.resolveAddressSuccess),
      filter(({ address }) => address.status !== 'VALIDATED'),
      map(({ address }) =>
        ToastActions.warning({
          title: 'Adresse bloquante',
          message:
            address.status === 'OUT_OF_ZONE'
              ? 'Zone hors couverture : choisissez un retrait en agence ou une autre adresse.'
              : "Adresse non validée : impossible de poursuivre l'envoi.",
        }),
      ),
    ),
  );

  /** Tarification : appelée à l'entrée de l'étape 2. */
  readonly loadOffers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShippingActions.loadOffers),
      withLatestFrom(
        this.store.select(selectSender),
        this.store.select(selectRecipient),
        this.store.select(selectParcelSpec),
      ),
      switchMap(([, sender, recipient, parcel]) => {
        if (!sender?.address || !recipient?.address) {
          return of(
            ShippingActions.loadOffersFailure({
              error: {
                code: 'ADDRESS_REQUIRED',
                message: 'Renseignez des adresses validées avant de calculer le tarif.',
              },
            }),
          );
        }
        return this.api
          .quotes({
            originAddressId: sender.address.id,
            destinationAddressId: recipient.address.id,
            parcel,
          })
          .pipe(
            map((offers) => ShippingActions.loadOffersSuccess({ offers })),
            catchError((error: ApiError) => of(ShippingActions.loadOffersFailure({ error }))),
          );
      }),
    ),
  );

  readonly create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShippingActions.createShipment),
      withLatestFrom(
        this.store.select(selectSender),
        this.store.select(selectRecipient),
        this.store.select(selectParcelSpec),
        this.store.select(selectSelectedServiceCode),
        this.store.select(selectSelectedOptionCodes),
      ),
      exhaustMap(([, sender, recipient, parcel, serviceCode, optionCodes]) => {
        if (!sender || !recipient || !serviceCode) {
          return of(
            ShippingActions.createShipmentFailure({
              error: { code: 'DRAFT_INCOMPLETE', message: "Dossier d'envoi incomplet." },
            }),
          );
        }
        const payload: ShipmentPayload = { sender, recipient, parcel, serviceCode, optionCodes };
        return this.api.create(payload).pipe(
          map((shipment) => ShippingActions.createShipmentSuccess({ shipment })),
          catchError((error: ApiError) => of(ShippingActions.createShipmentFailure({ error }))),
        );
      }),
    ),
  );

  readonly loadShipments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShippingActions.loadShipments),
      switchMap(() =>
        this.api.list().pipe(
          map((shipments) => ShippingActions.loadShipmentsSuccess({ shipments })),
          catchError((error: ApiError) => of(ShippingActions.loadShipmentsFailure({ error }))),
        ),
      ),
    ),
  );

  readonly loadRates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShippingActions.loadRates),
      switchMap(() =>
        this.api.rates().pipe(
          map((rates) => ShippingActions.loadRatesSuccess({ rates })),
          catchError((error: ApiError) => of(ShippingActions.loadRatesFailure({ error }))),
        ),
      ),
    ),
  );

  readonly createSuccessToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShippingActions.createShipmentSuccess),
      map(({ shipment }) =>
        ToastActions.show({
          toast: {
            type: 'success',
            title: 'Envoi confirmé',
            message: `Numéro de suivi ${shipment.trackingNumber} - enlèvement programmé.`,
            durationMs: 9000,
          },
        }),
      ),
    ),
  );

  readonly failures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ShippingActions.resolveAddressFailure,
        ShippingActions.loadOffersFailure,
        ShippingActions.createShipmentFailure,
        ShippingActions.loadShipmentsFailure,
        ShippingActions.loadRatesFailure,
      ),
      map(({ error }) => ToastActions.error({ message: error.message })),
    ),
  );

  /** Navigation du parcours en 3 étapes. */
  readonly navigateOnStep$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ShippingActions.goToStep),
        withLatestFrom(this.store.select(selectCanGoToService)),
        tap(([{ step }, canGoToService]) => {
          const routes = { 1: '/envoi', 2: '/envoi/service', 3: '/envoi/recapitulatif' } as const;
          if (step > 1 && !canGoToService) {
            this.router.navigate(['/envoi']);
            return;
          }
          this.router.navigate([routes[step]]);
        }),
      ),
    { dispatch: false },
  );
}
