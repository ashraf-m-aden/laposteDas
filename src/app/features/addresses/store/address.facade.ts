import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import type { AddressBookPayload } from '../../../core/models';
import { AddressActions } from './address.actions';
import {
  selectAddressBook,
  selectAddressError,
  selectBookOptions,
  selectBookStatus,
  selectDefaultEntry,
  selectDetailStatus,
  selectHasSuggestions,
  selectIsSelectionUsable,
  selectQuery,
  selectSaving,
  selectSearchStatus,
  selectSelectedAddress,
  selectSuggestions,
} from './address.selectors';

@Injectable({ providedIn: 'root' })
export class AddressFacade {
  private readonly store = inject(Store);

  readonly query = toSignal(this.store.select(selectQuery), { initialValue: '' });
  readonly suggestions = toSignal(this.store.select(selectSuggestions), { initialValue: [] });
  readonly hasSuggestions = toSignal(this.store.select(selectHasSuggestions), {
    initialValue: false,
  });
  readonly searchStatus = toSignal(this.store.select(selectSearchStatus), {
    initialValue: 'idle' as const,
  });
  readonly selected = toSignal(this.store.select(selectSelectedAddress), { initialValue: null });
  readonly detailStatus = toSignal(this.store.select(selectDetailStatus), {
    initialValue: 'idle' as const,
  });
  readonly isSelectionUsable = toSignal(this.store.select(selectIsSelectionUsable), {
    initialValue: false,
  });
  readonly book = toSignal(this.store.select(selectAddressBook), { initialValue: [] });
  readonly bookOptions = toSignal(this.store.select(selectBookOptions), { initialValue: [] });
  readonly bookStatus = toSignal(this.store.select(selectBookStatus), {
    initialValue: 'idle' as const,
  });
  readonly defaultEntry = toSignal(this.store.select(selectDefaultEntry), { initialValue: null });
  readonly saving = toSignal(this.store.select(selectSaving), { initialValue: false });
  readonly error = toSignal(this.store.select(selectAddressError), { initialValue: null });

  search(query: string): void {
    this.store.dispatch(AddressActions.search({ query }));
  }

  clearSuggestions(): void {
    this.store.dispatch(AddressActions.clearSuggestions());
  }

  selectSuggestion(id: string): void {
    this.store.dispatch(AddressActions.selectSuggestion({ id }));
  }

  clearSelection(): void {
    this.store.dispatch(AddressActions.clearSelection());
  }

  loadBook(): void {
    this.store.dispatch(AddressActions.loadBook());
  }

  addEntry(payload: AddressBookPayload): void {
    this.store.dispatch(AddressActions.addEntry({ payload }));
  }

  updateEntry(id: string, payload: AddressBookPayload): void {
    this.store.dispatch(AddressActions.updateEntry({ id, payload }));
  }

  removeEntry(id: string): void {
    this.store.dispatch(AddressActions.removeEntry({ id }));
  }

  setDefault(id: string): void {
    this.store.dispatch(AddressActions.setDefault({ id }));
  }
}
