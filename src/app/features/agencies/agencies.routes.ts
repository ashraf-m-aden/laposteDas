import { Routes } from '@angular/router';
import { provideAgencyStore } from './store';

export const AGENCY_ROUTES: Routes = [
  {
    path: '',
    providers: [provideAgencyStore()],
    children: [
      {
        path: '',
        title: 'Agences - La Poste de Djibouti',
        loadComponent: () =>
          import('./pages/agency-list/agency-list.page').then((m) => m.AgencyListPage),
      },
      {
        path: ':id',
        title: 'Détail agence - La Poste de Djibouti',
        loadComponent: () =>
          import('./pages/agency-detail/agency-detail.page').then((m) => m.AgencyDetailPage),
      },
    ],
  },
];
