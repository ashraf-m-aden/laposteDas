import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthApi } from '../../core/api/api.contracts';
import { TokenStorageService } from '../../core/services/token-storage.service';
import type { ApiError } from '../../core/models';
import { ToastActions } from '../toast/toast.actions';
import { selectQueryParam } from '../router/router.selectors';
import { AuthActions } from './auth.actions';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(AuthApi);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly router = inject(Router);
  private readonly store = inject(Store);

  readonly login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ credentials }) =>
        this.api.login(credentials).pipe(
          map((session) => AuthActions.loginSuccess({ session })),
          catchError((error: ApiError) => of(AuthActions.loginFailure({ error }))),
        ),
      ),
    ),
  );

  readonly register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(({ payload }) =>
        this.api.register(payload).pipe(
          map((session) => AuthActions.registerSuccess({ session })),
          catchError((error: ApiError) => of(AuthActions.registerFailure({ error }))),
        ),
      ),
    ),
  );

  /** Session mémorisée : jeton persisté puis profil rechargé au démarrage. */
  readonly persistSession$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess, AuthActions.registerSuccess),
        tap(({ session }) => this.tokenStorage.setToken(session.token)),
      ),
    { dispatch: false },
  );

  readonly restoreSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.restoreSession),
      map(() => this.tokenStorage.getToken()),
      switchMap((token) =>
        token
          ? this.api.me().pipe(
              map((user) => AuthActions.loadProfileSuccess({ user })),
              catchError((error: ApiError) => of(AuthActions.loadProfileFailure({ error }))),
            )
          : of(AuthActions.loadProfileFailure({ error: { code: 'NO_SESSION', message: '' } })),
      ),
    ),
  );

  readonly loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadProfile),
      switchMap(() =>
        this.api.me().pipe(
          map((user) => AuthActions.loadProfileSuccess({ user })),
          catchError((error: ApiError) => of(AuthActions.loadProfileFailure({ error }))),
        ),
      ),
    ),
  );

  readonly updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateProfile),
      exhaustMap(({ payload }) =>
        this.api.updateProfile(payload).pipe(
          map((user) => AuthActions.updateProfileSuccess({ user })),
          catchError((error: ApiError) => of(AuthActions.updateProfileFailure({ error }))),
        ),
      ),
    ),
  );

  readonly loadHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadHistory),
      switchMap(() =>
        this.api.history().pipe(
          map((items) => AuthActions.loadHistorySuccess({ items })),
          catchError((error: ApiError) => of(AuthActions.loadHistoryFailure({ error }))),
        ),
      ),
    ),
  );

  readonly logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      exhaustMap(() =>
        this.api.logout().pipe(
          tap(() => this.tokenStorage.clear()),
          map(() => AuthActions.logoutSuccess()),
          catchError(() => {
            this.tokenStorage.clear();
            return of(AuthActions.logoutSuccess());
          }),
        ),
      ),
    ),
  );

  /** Redirections applicatives. */
  readonly redirectAfterAuth$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess, AuthActions.registerSuccess),
        withLatestFrom(this.store.select(selectQueryParam('redirect'))),
        // Retour à l'écran demandé avant la connexion, sinon espace par défaut du rôle.
        tap(([{ session }, redirect]) => {
          const target =
            typeof redirect === 'string' && redirect
              ? redirect
              : session.user.type === 'BUSINESS'
                ? '/entreprise'
                : '/compte';
          this.router.navigateByUrl(target);
        }),
      ),
    { dispatch: false },
  );

  readonly redirectAfterLogout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => this.router.navigate(['/'])),
      ),
    { dispatch: false },
  );
}
