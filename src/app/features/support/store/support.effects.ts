import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';
import { SupportApi } from '../../../core/api/api.contracts';
import type { ApiError } from '../../../core/models';
import { ToastActions } from '../../../store/toast/toast.actions';
import { SupportActions } from './support.actions';

@Injectable()
export class SupportEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(SupportApi);

  readonly loadFaq$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SupportActions.loadFaq),
      switchMap(() =>
        this.api.faq().pipe(
          map((articles) => SupportActions.loadFaqSuccess({ articles })),
          catchError((error: ApiError) => of(SupportActions.loadFaqFailure({ error }))),
        ),
      ),
    ),
  );

  readonly loadTickets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SupportActions.loadTickets),
      switchMap(() =>
        this.api.tickets().pipe(
          map((tickets) => SupportActions.loadTicketsSuccess({ tickets })),
          catchError((error: ApiError) => of(SupportActions.loadTicketsFailure({ error }))),
        ),
      ),
    ),
  );

  readonly createTicket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SupportActions.createTicket),
      exhaustMap(({ payload }) =>
        this.api.createTicket(payload).pipe(
          map((ticket) => SupportActions.createTicketSuccess({ ticket })),
          catchError((error: ApiError) => of(SupportActions.createTicketFailure({ error }))),
        ),
      ),
    ),
  );

  readonly replyTicket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SupportActions.replyTicket),
      exhaustMap(({ id, body }) =>
        this.api.replyTicket(id, body).pipe(
          map((ticket) => SupportActions.replyTicketSuccess({ ticket })),
          catchError((error: ApiError) => of(SupportActions.replyTicketFailure({ error }))),
        ),
      ),
    ),
  );

  readonly successToasts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SupportActions.createTicketSuccess, SupportActions.replyTicketSuccess),
      map((action) =>
        action.type === SupportActions.createTicketSuccess.type
          ? ToastActions.success({
              title: 'Demande envoyée',
              message: `Votre demande ${action.ticket.reference} a été transmise au service client.`,
            })
          : ToastActions.success({ message: 'Réponse envoyée.' }),
      ),
    ),
  );

  readonly failures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        SupportActions.loadFaqFailure,
        SupportActions.loadTicketsFailure,
        SupportActions.createTicketFailure,
        SupportActions.replyTicketFailure,
      ),
      map(({ error }) => ToastActions.error({ message: error.message })),
    ),
  );
}
