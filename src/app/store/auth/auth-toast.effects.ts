import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';
import { ToastActions } from '../toast/toast.actions';
import { AuthActions } from './auth.actions';

/** Retour utilisateur (toasts) de tout le parcours compte. */
@Injectable()
export class AuthToastEffects {
  private readonly actions$ = inject(Actions);

  readonly loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      map(({ session }) =>
        ToastActions.success({
          title: 'Connexion réussie',
          message: `Bienvenue ${session.user.companyName ?? session.user.firstName}.`,
        }),
      ),
    ),
  );

  readonly registerSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerSuccess),
      map(({ session }) =>
        session.user.status === 'PENDING'
          ? ToastActions.info({
              title: 'Demande enregistrée',
              message: 'Votre compte entreprise est en attente de validation manuelle.',
            })
          : ToastActions.success({
              title: 'Compte créé',
              message: 'Votre compte client est actif.',
            }),
      ),
    ),
  );

  readonly updateProfileSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateProfileSuccess),
      map(() => ToastActions.success({ message: 'Profil mis à jour.' })),
    ),
  );

  readonly logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logoutSuccess),
      map(() => ToastActions.info({ message: 'Vous êtes déconnecté.' })),
    ),
  );

  readonly failures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        AuthActions.loginFailure,
        AuthActions.registerFailure,
        AuthActions.updateProfileFailure,
        AuthActions.loadHistoryFailure,
      ),
      map(({ error }) => ToastActions.error({ message: error.message })),
    ),
  );
}
