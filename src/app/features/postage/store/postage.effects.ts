import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { PostageApi } from '../../../core/api/api.contracts';
import type { ApiError } from '../../../core/models';
import { ToastActions } from '../../../store/toast/toast.actions';
import { PostageActions } from './postage.actions';
import { selectQuote } from './postage.selectors';

@Injectable()
export class PostageEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly api = inject(PostageApi);
  private readonly router = inject(Router);

  readonly loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostageActions.loadProducts),
      switchMap(() =>
        this.api.products().pipe(
          map((products) => PostageActions.loadProductsSuccess({ products })),
          catchError((error: ApiError) => of(PostageActions.loadProductsFailure({ error }))),
        ),
      ),
    ),
  );

  readonly quote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostageActions.requestQuote),
      switchMap(({ request }) =>
        this.api.quote(request).pipe(
          map((quote) => PostageActions.quoteSuccess({ quote })),
          catchError((error: ApiError) => of(PostageActions.quoteFailure({ error }))),
        ),
      ),
    ),
  );

  readonly pay$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostageActions.pay),
      withLatestFrom(this.store.select(selectQuote)),
      exhaustMap(([{ method }, quote]) => {
        if (!quote) {
          return of(
            PostageActions.payFailure({
              error: { code: 'QUOTE_REQUIRED', message: 'Calculez un tarif avant de payer.' },
            }),
          );
        }
        return this.api.pay({ quote, method }).pipe(
          map((label) => PostageActions.paySuccess({ label })),
          catchError((error: ApiError) => of(PostageActions.payFailure({ error }))),
        );
      }),
    ),
  );

  /** L'étiquette générée dispose de son propre écran (6.10). */
  readonly goToLabel$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PostageActions.paySuccess),
        tap(() => this.router.navigate(['/affranchissement/etiquette'])),
      ),
    { dispatch: false },
  );

  readonly paySuccessToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostageActions.paySuccess),
      map(({ label }) =>
        ToastActions.success({
          title: 'Paiement accepté',
          message: `Affranchissement ${label.reference} généré.`,
        }),
      ),
    ),
  );

  readonly failures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        PostageActions.loadProductsFailure,
        PostageActions.quoteFailure,
        PostageActions.payFailure,
      ),
      map(({ error }) => ToastActions.error({ message: error.message })),
    ),
  );
}
