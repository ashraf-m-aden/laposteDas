import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { SupportEffects } from './support.effects';
import { supportFeature } from './support.reducer';

export * from './support.state';
export * from './support.actions';
export * from './support.reducer';
export * from './support.selectors';
export * from './support.effects';
export * from './support.facade';

export const provideSupportStore = () => [
  provideState(supportFeature),
  provideEffects([SupportEffects]),
];
