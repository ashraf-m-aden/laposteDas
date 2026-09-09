import {
  ApplicationConfig,
  LOCALE_ID,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideApiLayer } from './core/api/api.providers';
import { apiUrlInterceptor } from './core/interceptors/api-url.interceptor';
import { authTokenInterceptor } from './core/interceptors/auth-token.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { provideAppStore } from './store/store.providers';
import { AuthActions } from './store/auth/auth.actions';
import { UiActions } from './store/ui/ui.actions';
import { environment } from '../environments/environment';
import type { Language } from './core/models';
import { routes } from './app.routes';

/** Langue mémorisée, sinon langue par défaut de l'environnement. */
function storedLanguage(): Language {
  try {
    const stored = localStorage.getItem(environment.storageKeys.language);
    if (stored === 'fr' || stored === 'en') {
      return stored;
    }
  } catch {
    /* stockage indisponible */
  }
  return environment.defaultLanguage;
}

// Formats de date et de nombre en français (interface bilingue, section 8).
registerLocaleData(localeFr, 'fr-FR');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
    ),
    // Ordre des intercepteurs : URL de base -> jeton -> normalisation des erreurs.
    provideHttpClient(
      withInterceptors([apiUrlInterceptor, authTokenInterceptor, errorInterceptor]),
    ),
    // Store racine (toast, ui, auth, router) + devtools.
    ...provideAppStore(),
    // Câblage backend : mock ou back-end postal .NET selon `environment.useMock`.
    ...provideApiLayer(),
    // Restauration langue + session AVANT la première navigation (sinon les gardes rejettent).
    provideAppInitializer(() => {
      const store = inject(Store);
      store.dispatch(UiActions.restoreLanguage({ language: storedLanguage() }));
      store.dispatch(AuthActions.restoreSession());
    }),
  ],
};
