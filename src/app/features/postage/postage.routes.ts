import { Routes } from '@angular/router';
import { provideAddressStore } from '../addresses/store';
import { providePostageStore } from './store';

export const POSTAGE_ROUTES: Routes = [
  {
    path: '',
    providers: [providePostageStore(), provideAddressStore()],
    // Catalogue et simulateur publics ; la connexion est demandée au paiement.
    children: [
      {
        path: '',
        title: 'Affranchissement - La Poste de Djibouti',
        loadComponent: () =>
          import('./pages/postage-catalog/postage-catalog.page').then((m) => m.PostageCatalogPage),
      },
      {
        path: 'tarif',
        title: 'Tarif et paiement - La Poste de Djibouti',
        loadComponent: () =>
          import('./pages/postage-quote/postage-quote.page').then((m) => m.PostageQuotePage),
      },
      {
        path: 'etiquette',
        title: 'Étiquette - La Poste de Djibouti',
        loadComponent: () =>
          import('./pages/postage-label/postage-label.page').then((m) => m.PostageLabelPage),
      },
    ],
  },
];
