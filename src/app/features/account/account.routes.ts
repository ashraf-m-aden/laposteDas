import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

/**
 * Le compte s'appuie sur la slice `auth` du store racine
 * (nécessaire à l'en-tête et aux gardes de route).
 */
export const ACCOUNT_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    title: 'Mon compte - La Poste de Djibouti',
    loadComponent: () => import('./pages/profile/profile.page').then((m) => m.ProfilePage),
  },
  {
    path: 'connexion',
    title: 'Connexion - La Poste de Djibouti',
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'inscription',
    title: 'Inscription - La Poste de Djibouti',
    loadComponent: () => import('./pages/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'historique',
    canActivate: [authGuard],
    title: 'Historique - La Poste de Djibouti',
    loadComponent: () => import('./pages/history/history.page').then((m) => m.HistoryPage),
  },
];
