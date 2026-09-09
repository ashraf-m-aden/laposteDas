import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { provideNotificationStore } from './store';

export const NOTIFICATION_ROUTES: Routes = [
  {
    path: '',
    providers: [provideNotificationStore()],
    canActivate: [authGuard],
    title: 'Notifications - La Poste de Djibouti',
    loadComponent: () =>
      import('./pages/notification-center/notification-center.page').then(
        (m) => m.NotificationCenterPage,
      ),
  },
];
