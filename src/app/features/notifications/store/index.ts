import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { NotificationEffects } from './notification.effects';
import { notificationFeature } from './notification.reducer';

export * from './notification.state';
export * from './notification.actions';
export * from './notification.reducer';
export * from './notification.selectors';
export * from './notification.effects';
export * from './notification.facade';

export const provideNotificationStore = () => [
  provideState(notificationFeature),
  provideEffects([NotificationEffects]),
];
