import { Routes } from '@angular/router';
import { authGuard, businessGuard } from '../../core/guards/auth.guard';
import { provideAddressStore } from '../addresses/store';
import { provideShippingStore } from './store';

/** Le parcours d'envoi a besoin des deux slices : envoi + adresses (autocomplétion). */
export const SHIPPING_ROUTES: Routes = [
  {
    path: '',
    providers: [provideShippingStore(), provideAddressStore()],
    // Vitrine d'abord : le parcours est visible sans compte, la connexion
    // n'est demandée qu'à la confirmation de l'envoi (voir la page récapitulatif).
    children: [
      {
        path: '',
        title: 'Envoyer un colis - La Poste de Djibouti',
        loadComponent: () =>
          import('./pages/shipping-parties/shipping-parties.page').then(
            (m) => m.ShippingPartiesPage,
          ),
      },
      {
        path: 'service',
        title: 'Choix de la prestation - La Poste de Djibouti',
        loadComponent: () =>
          import('./pages/shipping-service/shipping-service.page').then(
            (m) => m.ShippingServicePage,
          ),
      },
      {
        path: 'recapitulatif',
        title: 'Récapitulatif - La Poste de Djibouti',
        loadComponent: () =>
          import('./pages/shipping-summary/shipping-summary.page').then(
            (m) => m.ShippingSummaryPage,
          ),
      },
    ],
  },
];

/** Espace entreprise (6.15 / 6.16). */
export const BUSINESS_ROUTES: Routes = [
  {
    path: '',
    providers: [provideShippingStore()],
    canActivate: [authGuard, businessGuard],
    children: [
      {
        path: '',
        title: 'Tableau de bord entreprise - La Poste de Djibouti',
        loadComponent: () =>
          import('./pages/shipping-dashboard/shipping-dashboard.page').then(
            (m) => m.ShippingDashboardPage,
          ),
      },
      {
        path: 'tarifs',
        title: 'Tarifs entreprise - La Poste de Djibouti',
        loadComponent: () =>
          import('./pages/business-rates/business-rates.page').then((m) => m.BusinessRatesPage),
      },
    ],
  },
];
