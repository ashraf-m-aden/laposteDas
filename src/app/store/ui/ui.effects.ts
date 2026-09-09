import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ToastActions } from '../toast/toast.actions';
import { UiActions } from './ui.actions';

@Injectable()
export class UiEffects {
  private readonly actions$ = inject(Actions);

  /** Mémorise la langue choisie pour les visites suivantes. */
  readonly persistLanguage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UiActions.setLanguage),
        tap(({ language }) => {
          try {
            localStorage.setItem(environment.storageKeys.language, language);
          } catch {
            /* stockage indisponible */
          }
        }),
      ),
    { dispatch: false },
  );

  /** Confirme visuellement le changement de langue (section 8 : i18n FR/EN). */
  readonly notifyLanguage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UiActions.setLanguage),
      map(({ language }) =>
        ToastActions.info({
          message: language === 'fr' ? 'Langue : Français' : 'Language: English',
        }),
      ),
    ),
  );

  /** État réseau : le cahier des charges impose un état "erreur réseau" par écran. */
  readonly connectionLost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UiActions.connectionChanged),
      map(({ online }) =>
        online
          ? ToastActions.success({ message: 'Connexion rétablie.' })
          : ToastActions.warning({ message: 'Vous êtes hors connexion.' }),
      ),
    ),
  );
}
