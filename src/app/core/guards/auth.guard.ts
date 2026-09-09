import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map, take } from 'rxjs';
import { selectAuthGate } from '../../store/auth/auth.selectors';
import { ToastActions } from '../../store/toast/toast.actions';

/**
 * Gardes de route (section 5). Elles attendent la résolution de la session
 * mémorisée (`initialized`) pour ne pas rejeter un utilisateur pendant le
 * rechargement de son profil au démarrage.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectAuthGate).pipe(
    filter((gate) => gate.initialized),
    take(1),
    map((gate) => {
      if (gate.isAuthenticated) {
        return true;
      }
      store.dispatch(
        ToastActions.warning({ message: 'Connectez-vous pour accéder à cet espace.' }),
      );
      return router.createUrlTree(['/compte/connexion'], {
        queryParams: { redirect: state.url },
      });
    }),
  );
};

/** Réserve un écran aux comptes entreprise (6.15 / 6.16). */
export const businessGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectAuthGate).pipe(
    filter((gate) => gate.initialized),
    take(1),
    map((gate) => {
      if (gate.isBusiness) {
        return true;
      }
      store.dispatch(ToastActions.warning({ message: 'Espace réservé aux comptes entreprise.' }));
      return router.createUrlTree(['/compte/connexion']);
    }),
  );
};
