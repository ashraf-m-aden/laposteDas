import { Routes } from '@angular/router';

/**
 * Routage par domaine métier : chaque feature charge son composant ET sa slice NgRx
 * à la demande (voir `provide*Store()` dans chaque fichier de routes).
 */
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'La Poste de Djibouti - Services Clients',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'suivi',
    loadChildren: () => import('./features/tracking/tracking.routes').then((m) => m.TRACKING_ROUTES),
  },
  {
    path: 'envoi',
    loadChildren: () => import('./features/shipping/shipping.routes').then((m) => m.SHIPPING_ROUTES),
  },
  {
    path: 'entreprise',
    loadChildren: () => import('./features/shipping/shipping.routes').then((m) => m.BUSINESS_ROUTES),
  },
  {
    path: 'affranchissement',
    loadChildren: () => import('./features/postage/postage.routes').then((m) => m.POSTAGE_ROUTES),
  },
  {
    path: 'agences',
    loadChildren: () => import('./features/agencies/agencies.routes').then((m) => m.AGENCY_ROUTES),
  },
  {
    path: 'adresses',
    loadChildren: () =>
      import('./features/addresses/addresses.routes').then((m) => m.ADDRESS_ROUTES),
  },
  {
    path: 'notifications',
    loadChildren: () =>
      import('./features/notifications/notifications.routes').then((m) => m.NOTIFICATION_ROUTES),
  },
  {
    path: 'aide',
    loadChildren: () => import('./features/support/support.routes').then((m) => m.SUPPORT_ROUTES),
  },
  {
    path: 'compte',
    loadChildren: () => import('./features/account/account.routes').then((m) => m.ACCOUNT_ROUTES),
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.page').then((m) => m.NotFoundPage),
  },
];
