import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { AddressEffects } from './address.effects';
import { addressFeature } from './address.reducer';

export * from './address.state';
export * from './address.actions';
export * from './address.reducer';
export * from './address.selectors';
export * from './address.effects';
export * from './address.facade';

/** Slice partagée : la route "envoi" la fournit aussi (autocomplétion d'adresse). */
export const provideAddressStore = () => [
  provideState(addressFeature),
  provideEffects([AddressEffects]),
];
