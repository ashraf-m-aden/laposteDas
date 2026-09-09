import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { TrackingEffects } from './tracking.effects';
import { trackingFeature } from './tracking.reducer';

export * from './tracking.state';
export * from './tracking.actions';
export * from './tracking.reducer';
export * from './tracking.selectors';
export * from './tracking.effects';
export * from './tracking.facade';

/** Slice chargée à la demande avec la route "suivi". */
export const provideTrackingStore = () => [
  provideState(trackingFeature),
  provideEffects([TrackingEffects]),
];
