import { createFeature, createReducer, on } from '@ngrx/store';
import { AddressActions } from './address.actions';
import { ADDRESS_FEATURE_KEY, initialAddressState } from './address.state';

export const addressFeature = createFeature({
  name: ADDRESS_FEATURE_KEY,
  reducer: createReducer(
    initialAddressState,
    on(AddressActions.search, (state, { query }) => ({
      ...state,
      query,
      searchStatus: query.trim().length < 2 ? ('idle' as const) : ('loading' as const),
    })),
    on(AddressActions.searchSuccess, (state, { suggestions }) => ({
      ...state,
      suggestions,
      searchStatus: suggestions.length ? ('loaded' as const) : ('empty' as const),
    })),
    on(AddressActions.searchFailure, (state, { error }) => ({
      ...state,
      searchStatus: 'error' as const,
      error,
    })),
    on(AddressActions.clearSuggestions, (state) => ({
      ...state,
      suggestions: [],
      searchStatus: 'idle' as const,
      query: '',
    })),
    on(AddressActions.selectSuggestion, (state) => ({ ...state, detailStatus: 'loading' as const })),
    on(AddressActions.loadAddressSuccess, (state, { address }) => ({
      ...state,
      selected: address,
      detailStatus: 'loaded' as const,
      error: null,
    })),
    on(AddressActions.loadAddressFailure, (state, { error }) => ({
      ...state,
      selected: null,
      detailStatus: 'error' as const,
      error,
    })),
    on(AddressActions.clearSelection, (state) => ({
      ...state,
      selected: null,
      detailStatus: 'idle' as const,
    })),
    on(AddressActions.loadBook, (state) => ({ ...state, bookStatus: 'loading' as const })),
    on(AddressActions.loadBookSuccess, (state, { entries }) => ({
      ...state,
      book: entries,
      bookStatus: entries.length ? ('loaded' as const) : ('empty' as const),
    })),
    on(AddressActions.loadBookFailure, (state, { error }) => ({
      ...state,
      bookStatus: 'error' as const,
      error,
    })),
    on(AddressActions.addEntry, AddressActions.updateEntry, (state) => ({
      ...state,
      saving: true,
    })),
    on(AddressActions.addEntrySuccess, (state, { entry }) => ({
      ...state,
      saving: false,
      bookStatus: 'loaded' as const,
      book: entry.isDefault
        ? [...state.book.map((item) => ({ ...item, isDefault: false })), entry]
        : [...state.book, entry],
    })),
    on(AddressActions.updateEntrySuccess, (state, { entry }) => ({
      ...state,
      saving: false,
      book: state.book.map((item) => (item.id === entry.id ? entry : item)),
    })),
    on(AddressActions.removeEntrySuccess, (state, { id }) => {
      const book = state.book.filter((item) => item.id !== id);
      return { ...state, book, bookStatus: book.length ? ('loaded' as const) : ('empty' as const) };
    }),
    on(AddressActions.setDefaultSuccess, (state, { entries }) => ({ ...state, book: entries })),
    on(
      AddressActions.addEntryFailure,
      AddressActions.updateEntryFailure,
      AddressActions.removeEntryFailure,
      AddressActions.setDefaultFailure,
      (state, { error }) => ({ ...state, saving: false, error }),
    ),
  ),
});
