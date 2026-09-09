import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, mergeMap, of, switchMap } from 'rxjs';
import { NotificationApi } from '../../../core/api/api.contracts';
import type { ApiError } from '../../../core/models';
import { ToastActions } from '../../../store/toast/toast.actions';
import { NotificationActions } from './notification.actions';

@Injectable()
export class NotificationEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(NotificationApi);

  readonly load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.load),
      switchMap(() =>
        this.api.list().pipe(
          map((notifications) => NotificationActions.loadSuccess({ notifications })),
          catchError((error: ApiError) => of(NotificationActions.loadFailure({ error }))),
        ),
      ),
    ),
  );

  readonly markAsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.markAsRead),
      mergeMap(({ id }) =>
        this.api.markAsRead(id).pipe(
          map((notification) => NotificationActions.markAsReadSuccess({ notification })),
          catchError((error: ApiError) => of(NotificationActions.markFailure({ error }))),
        ),
      ),
    ),
  );

  readonly markAllAsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.markAllAsRead),
      exhaustMap(() =>
        this.api.markAllAsRead().pipe(
          map((notifications) => NotificationActions.markAllAsReadSuccess({ notifications })),
          catchError((error: ApiError) => of(NotificationActions.markFailure({ error }))),
        ),
      ),
    ),
  );

  readonly markAllToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.markAllAsReadSuccess),
      map(() => ToastActions.success({ message: 'Toutes les notifications sont marquées comme lues.' })),
    ),
  );

  readonly failures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.loadFailure, NotificationActions.markFailure),
      map(({ error }) => ToastActions.error({ message: error.message })),
    ),
  );
}
