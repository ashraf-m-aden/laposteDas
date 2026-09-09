import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { provideSupportStore } from './store';

export const SUPPORT_ROUTES: Routes = [
  {
    path: '',
    providers: [provideSupportStore()],
    children: [
      {
        path: '',
        title: 'Aide - La Poste de Djibouti',
        loadComponent: () => import('./pages/faq/faq.page').then((m) => m.FaqPage),
      },
      {
        path: 'contact',
        canActivate: [authGuard],
        title: 'Contact - La Poste de Djibouti',
        loadComponent: () => import('./pages/tickets/tickets.page').then((m) => m.TicketsPage),
      },
    ],
  },
];
