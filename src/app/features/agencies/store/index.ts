import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { AgencyEffects } from './agency.effects';
import { agencyFeature } from './agency.reducer';

export * from './agency.state';
export * from './agency.actions';
export * from './agency.reducer';
export * from './agency.selectors';
export * from './agency.effects';
export * from './agency.facade';

export const provideAgencyStore = () => [
  provideState(agencyFeature),
  provideEffects([AgencyEffects]),
];
