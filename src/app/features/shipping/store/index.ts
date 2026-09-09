import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { ShippingEffects } from './shipping.effects';
import { shippingFeature } from './shipping.reducer';

export * from './shipping.state';
export * from './shipping.actions';
export * from './shipping.reducer';
export * from './shipping.selectors';
export * from './shipping.effects';
export * from './shipping.facade';

export const provideShippingStore = () => [
  provideState(shippingFeature),
  provideEffects([ShippingEffects]),
];
