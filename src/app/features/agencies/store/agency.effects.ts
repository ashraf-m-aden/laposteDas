import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, debounceTime, map, of, switchMap, withLatestFrom } from 'rxjs';
import { AgencyApi } from '../../../core/api/api.contracts';
import type { ApiError } from '../../../core/models';
import { ToastActions } from '../../../store/toast/toast.actions';
import { AgencyActions } from './agency.actions';
import { selectAgencyFilters } from './agency.selectors';

@Injectable()
export class AgencyEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly api = inject(AgencyApi);

  /** Le chargement suit les filtres : toute modification relance la requête. */
  readonly load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AgencyActions.load, AgencyActions.updateFilters, AgencyActions.resetFilters),
      debounceTime(250),
      withLatestFrom(this.store.select(selectAgencyFilters)),
      switchMap(([, filters]) =>
        this.api.list(filters).pipe(
          map((agencies) => AgencyActions.loadSuccess({ agencies })),
          catchError((error: ApiError) => of(AgencyActions.loadFailure({ error }))),
        ),
      ),
    ),
  );

  readonly loadDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AgencyActions.loadDetail),
      switchMap(({ id }) =>
        this.api.getById(id).pipe(
          map((agency) => AgencyActions.loadDetailSuccess({ agency })),
          catchError((error: ApiError) => of(AgencyActions.loadDetailFailure({ error }))),
        ),
      ),
    ),
  );

  readonly failure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AgencyActions.loadFailure, AgencyActions.loadDetailFailure),
      map(({ error }) => ToastActions.error({ message: error.message })),
    ),
  );
}
