import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { provideAddressStore } from './store';

export const ADDRESS_ROUTES: Routes = [
  {
    path: '',
    providers: [provideAddressStore()],
    children: [
      {
        path: '',
        title: "Recherche d'adresse - La Poste de Djibouti",
        loadComponent: () =>
          import('./pages/address-search/address-search.page').then((m) => m.AddressSearchPage),
      },
      {
        path: 'carnet',
        canActivate: [authGuard],
        title: "Carnet d'adresses - La Poste de Djibouti",
        loadComponent: () =>
          import('./pages/address-book/address-book.page').then((m) => m.AddressBookPage),
      },
    ],
  },
];
