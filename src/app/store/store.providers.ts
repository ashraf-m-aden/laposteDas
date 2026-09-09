import { EnvironmentProviders, Provider, isDevMode } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { AuthEffects } from './auth/auth.effects';
import { AuthToastEffects } from './auth/auth-toast.effects';
import { authFeature } from './auth/auth.reducer';
import { ToastEffects } from './toast/toast.effects';
import { toastFeature } from './toast/toast.reducer';
import { UiEffects } from './ui/ui.effects';
import { uiFeature } from './ui/ui.reducer';

/**
 * Store racine : slices toujours chargées (toast, ui, auth, router).
 * Les slices métier sont fournies par route via `provideState` / `provideEffects`.
 */
export function provideAppStore(): (Provider | EnvironmentProviders)[] {
  return [
    provideStore({ router: routerReducer }),
    provideRouterStore(),
    provideState(toastFeature),
    provideState(uiFeature),
    provideState(authFeature),
    provideEffects([ToastEffects, UiEffects, AuthEffects, AuthToastEffects]),
    provideStoreDevtools({
      maxAge: 50,
      logOnly: !isDevMode(),
      connectInZone: true,
      name: 'La Poste de Djibouti - Services Clients',
    }),
  ];
}
