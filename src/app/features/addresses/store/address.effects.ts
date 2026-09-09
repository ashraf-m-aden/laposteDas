import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  of,
  switchMap,
  mergeMap,
} from 'rxjs';
import { AddressApi } from '../../../core/api/api.contracts';
import type { ApiError } from '../../../core/models';
import { ToastActions } from '../../../store/toast/toast.actions';
import { AddressActions } from './address.actions';

@Injectable()
export class AddressEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(AddressApi);

  /** Autocomplétion : 300 ms de debounce, 2 caractères minimum. */
  readonly search$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressActions.search),
      debounceTime(300),
      map(({ query }) => query.trim()),
      distinctUntilChanged(),
      filter((query) => query.length >= 2),
      switchMap((query) =>
        this.api.search(query).pipe(
          map((suggestions) => AddressActions.searchSuccess({ suggestions })),
          catchError((error: ApiError) => of(AddressActions.searchFailure({ error }))),
        ),
      ),
    ),
  );

  readonly loadAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressActions.selectSuggestion),
      switchMap(({ id }) =>
        this.api.getById(id).pipe(
          map((address) => AddressActions.loadAddressSuccess({ address })),
          catchError((error: ApiError) => of(AddressActions.loadAddressFailure({ error }))),
        ),
      ),
    ),
  );

  /** Une adresse hors zone reste consultable mais bloque les parcours d'envoi. */
  readonly warnOutOfZone$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressActions.loadAddressSuccess),
      filter(({ address }) => address.status !== 'VALIDATED'),
      map(({ address }) =>
        ToastActions.warning({
          title: 'Adresse non utilisable',
          message:
            address.status === 'OUT_OF_ZONE'
              ? 'Cette adresse est hors zone de couverture pour la livraison à domicile.'
              : "Cette adresse n'est pas validée par le référentiel postal.",
        }),
      ),
    ),
  );

  readonly loadBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressActions.loadBook),
      switchMap(() =>
        this.api.listBook().pipe(
          map((entries) => AddressActions.loadBookSuccess({ entries })),
          catchError((error: ApiError) => of(AddressActions.loadBookFailure({ error }))),
        ),
      ),
    ),
  );

  readonly addEntry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressActions.addEntry),
      mergeMap(({ payload }) =>
        this.api.addToBook(payload).pipe(
          map((entry) => AddressActions.addEntrySuccess({ entry })),
          catchError((error: ApiError) => of(AddressActions.addEntryFailure({ error }))),
        ),
      ),
    ),
  );

  readonly updateEntry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressActions.updateEntry),
      mergeMap(({ id, payload }) =>
        this.api.updateBookEntry(id, payload).pipe(
          map((entry) => AddressActions.updateEntrySuccess({ entry })),
          catchError((error: ApiError) => of(AddressActions.updateEntryFailure({ error }))),
        ),
      ),
    ),
  );

  readonly removeEntry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressActions.removeEntry),
      mergeMap(({ id }) =>
        this.api.removeFromBook(id).pipe(
          map(() => AddressActions.removeEntrySuccess({ id })),
          catchError((error: ApiError) => of(AddressActions.removeEntryFailure({ error }))),
        ),
      ),
    ),
  );

  readonly setDefault$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressActions.setDefault),
      mergeMap(({ id }) =>
        this.api.setDefault(id).pipe(
          map((entries) => AddressActions.setDefaultSuccess({ entries })),
          catchError((error: ApiError) => of(AddressActions.setDefaultFailure({ error }))),
        ),
      ),
    ),
  );

  readonly successToasts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        AddressActions.addEntrySuccess,
        AddressActions.updateEntrySuccess,
        AddressActions.removeEntrySuccess,
        AddressActions.setDefaultSuccess,
      ),
      map((action) => {
        switch (action.type) {
          case AddressActions.addEntrySuccess.type:
            return ToastActions.success({ message: 'Adresse ajoutée au carnet.' });
          case AddressActions.updateEntrySuccess.type:
            return ToastActions.success({ message: 'Adresse mise à jour.' });
          case AddressActions.removeEntrySuccess.type:
            return ToastActions.info({ message: 'Adresse supprimée du carnet.' });
          default:
            return ToastActions.success({ message: 'Adresse par défaut modifiée.' });
        }
      }),
    ),
  );

  readonly failureToasts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        AddressActions.searchFailure,
        AddressActions.loadAddressFailure,
        AddressActions.loadBookFailure,
        AddressActions.addEntryFailure,
        AddressActions.updateEntryFailure,
        AddressActions.removeEntryFailure,
        AddressActions.setDefaultFailure,
      ),
      map(({ error }) => ToastActions.error({ message: error.message })),
    ),
  );
}
