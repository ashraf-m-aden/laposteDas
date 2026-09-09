import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { PostageEffects } from './postage.effects';
import { postageFeature } from './postage.reducer';

export * from './postage.state';
export * from './postage.actions';
export * from './postage.reducer';
export * from './postage.selectors';
export * from './postage.effects';
export * from './postage.facade';

export const providePostageStore = () => [
  provideState(postageFeature),
  provideEffects([PostageEffects]),
];
