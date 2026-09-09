import { Routes } from '@angular/router';
import { provideTrackingStore } from './store';

/** Route "suivi" : la slice NgRx est fournie ici, donc chargée à la demande. */
export const TRACKING_ROUTES: Routes = [
  {
    path: '',
    providers: [provideTrackingStore()],
    children: [
      {
        path: '',
        title: 'Suivre un colis - La Poste de Djibouti',
        loadComponent: () =>
          import('./pages/tracking-search/tracking-search.page').then((m) => m.TrackingSearchPage),
      },
      {
        path: ':trackingNumber',
        title: 'Suivi de colis - La Poste de Djibouti',
        loadComponent: () =>
          import('./pages/tracking-timeline/tracking-timeline.page').then(
            (m) => m.TrackingTimelinePage,
          ),
      },
    ],
  },
];
