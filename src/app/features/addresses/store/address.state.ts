import type {
  AddressBookEntry,
  AddressSuggestion,
  ApiError,
  NormalizedAddress,
  ViewStatus,
} from '../../../core/models';

export const ADDRESS_FEATURE_KEY = 'addresses';

export interface AddressState {
  query: string;
  suggestions: AddressSuggestion[];
  searchStatus: ViewStatus;
  selected: NormalizedAddress | null;
  detailStatus: ViewStatus;
  book: AddressBookEntry[];
  bookStatus: ViewStatus;
  saving: boolean;
  error: ApiError | null;
}

export const initialAddressState: AddressState = {
  query: '',
  suggestions: [],
  searchStatus: 'idle',
  selected: null,
  detailStatus: 'idle',
  book: [],
  bookStatus: 'idle',
  saving: false,
  error: null,
};
