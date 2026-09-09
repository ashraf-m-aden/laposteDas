import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type {
  AddressBookEntry,
  AddressBookPayload,
  AddressSuggestion,
  ApiError,
  NormalizedAddress,
} from '../../../core/models';

export const AddressActions = createActionGroup({
  source: 'Addresses',
  events: {
    Search: props<{ query: string }>(),
    'Search Success': props<{ suggestions: AddressSuggestion[] }>(),
    'Search Failure': props<{ error: ApiError }>(),
    'Clear Suggestions': emptyProps(),
    'Select Suggestion': props<{ id: string }>(),
    'Load Address Success': props<{ address: NormalizedAddress }>(),
    'Load Address Failure': props<{ error: ApiError }>(),
    'Clear Selection': emptyProps(),
    'Load Book': emptyProps(),
    'Load Book Success': props<{ entries: AddressBookEntry[] }>(),
    'Load Book Failure': props<{ error: ApiError }>(),
    'Add Entry': props<{ payload: AddressBookPayload }>(),
    'Add Entry Success': props<{ entry: AddressBookEntry }>(),
    'Add Entry Failure': props<{ error: ApiError }>(),
    'Update Entry': props<{ id: string; payload: AddressBookPayload }>(),
    'Update Entry Success': props<{ entry: AddressBookEntry }>(),
    'Update Entry Failure': props<{ error: ApiError }>(),
    'Remove Entry': props<{ id: string }>(),
    'Remove Entry Success': props<{ id: string }>(),
    'Remove Entry Failure': props<{ error: ApiError }>(),
    'Set Default': props<{ id: string }>(),
    'Set Default Success': props<{ entries: AddressBookEntry[] }>(),
    'Set Default Failure': props<{ error: ApiError }>(),
  },
});
