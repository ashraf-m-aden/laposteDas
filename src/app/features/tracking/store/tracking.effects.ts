import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { TrackingApi } from '../../../core/api/api.contracts';
import type { ApiError, RecentTracking } from '../../../core/models';
import { environment } from '../../../../environments/environment';
import { ToastActions } from '../../../store/toast/toast.actions';
import { TrackingActions } from './tracking.actions';

@Injectable()
export class TrackingEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(TrackingApi);

  readonly track$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackingActions.track),
      switchMap(({ trackingNumber }) =>
        this.api.track(trackingNumber).pipe(
          map((parcel) => TrackingActions.trackSuccess({ parcel })),
          catchError((error: ApiError) =>
            of(TrackingActions.trackFailure({ trackingNumber, error })),
          ),
        ),
      ),
    ),
  );

  readonly toggleNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackingActions.toggleNotifications),
      switchMap(({ trackingNumber, enabled }) =>
        this.api.subscribeNotifications(trackingNumber, enabled).pipe(
          map((parcel) => TrackingActions.toggleNotificationsSuccess({ parcel })),
          catchError((error: ApiError) =>
            of(TrackingActions.toggleNotificationsFailure({ error })),
          ),
        ),
      ),
    ),
  );

  readonly notifySubscription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackingActions.toggleNotificationsSuccess),
      map(({ parcel }) =>
        parcel.notificationsEnabled
          ? ToastActions.success({
              message: `Vous serez alerté des étapes du colis ${parcel.trackingNumber}.`,
            })
          : ToastActions.info({ message: 'Notifications désactivées pour ce colis.' }),
      ),
    ),
  );

  readonly notifyFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackingActions.trackFailure, TrackingActions.toggleNotificationsFailure),
      map(({ error }) => ToastActions.error({ message: error.message })),
    ),
  );

  /** Historique des derniers suivis (6.2 : conservé localement). */
  readonly persistRecent$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TrackingActions.trackSuccess),
        tap(({ parcel }) => {
          const entry: RecentTracking = {
            trackingNumber: parcel.trackingNumber,
            searchedAt: new Date().toISOString(),
            status: parcel.status,
          };
          const stored = readRecent().filter(
            (item) => item.trackingNumber !== entry.trackingNumber,
          );
          writeRecent([entry, ...stored].slice(0, 5));
        }),
      ),
    { dispatch: false },
  );

  readonly clearRecent$ = createEffect(
    () => this.actions$.pipe(ofType(TrackingActions.clearRecent), tap(() => writeRecent([]))),
    { dispatch: false },
  );
}

export function readRecent(): RecentTracking[] {
  try {
    return JSON.parse(localStorage.getItem(environment.storageKeys.recentTracking) ?? '[]');
  } catch {
    return [];
  }
}

function writeRecent(items: RecentTracking[]): void {
  try {
    localStorage.setItem(environment.storageKeys.recentTracking, JSON.stringify(items));
  } catch {
    /* stockage indisponible */
  }
}
