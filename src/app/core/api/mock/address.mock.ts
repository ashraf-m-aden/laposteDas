import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddressApi } from '../api.contracts';
import type {
  AddressBookEntry,
  AddressBookPayload,
  AddressSuggestion,
  NormalizedAddress,
} from '../../models';
import { MOCK_ADDRESSES, MOCK_ADDRESS_BOOK } from '../../mock/mock-addresses';
import { clone, mockError, mockResponse, uid } from '../../mock/mock.util';

/** Implémentation factice du référentiel d'adresses (relayé par le back-end postal). */
@Injectable()
export class AddressMockApi extends AddressApi {
  private book: AddressBookEntry[] = clone(MOCK_ADDRESS_BOOK);

  search(query: string): Observable<AddressSuggestion[]> {
    const needle = query.trim().toLowerCase();
    if (needle.length < 2) {
      return mockResponse<AddressSuggestion[]>([]);
    }
    const suggestions = MOCK_ADDRESSES.filter((address) =>
      `${address.formatted} ${address.district} ${address.city}`.toLowerCase().includes(needle),
    ).map((address) => ({
      id: address.id,
      label: address.formatted,
      city: address.city,
      region: address.region,
    }));
    return mockResponse(clone(suggestions));
  }

  getById(id: string): Observable<NormalizedAddress> {
    const address = MOCK_ADDRESSES.find((item) => item.id === id);
    return address
      ? mockResponse(clone(address))
      : mockError('ADDRESS_NOT_FOUND', "Cette adresse n'est pas reconnue par le référentiel.");
  }

  listBook(): Observable<AddressBookEntry[]> {
    return mockResponse(clone(this.book));
  }

  addToBook(payload: AddressBookPayload): Observable<AddressBookEntry> {
    const address = MOCK_ADDRESSES.find((item) => item.id === payload.addressId);
    if (!address) {
      return mockError('ADDRESS_NOT_VALIDATED', 'Adresse non validée : enregistrement bloqué.');
    }
    const entry: AddressBookEntry = {
      id: uid('CAR'),
      contactName: payload.contactName,
      phone: payload.phone,
      kind: payload.kind,
      isDefault: payload.isDefault,
      address: clone(address),
    };
    this.book = payload.isDefault
      ? [...this.book.map((item) => ({ ...item, isDefault: false })), entry]
      : [...this.book, entry];
    return mockResponse(clone(entry));
  }

  updateBookEntry(id: string, payload: AddressBookPayload): Observable<AddressBookEntry> {
    const existing = this.book.find((item) => item.id === id);
    const address = MOCK_ADDRESSES.find((item) => item.id === payload.addressId);
    if (!existing || !address) {
      return mockError('ADDRESS_BOOK_ENTRY_NOT_FOUND', 'Entrée du carnet introuvable.');
    }
    const updated: AddressBookEntry = { ...existing, ...payload, address: clone(address) };
    this.book = this.book.map((item) => (item.id === id ? updated : item));
    return mockResponse(clone(updated));
  }

  removeFromBook(id: string): Observable<string> {
    this.book = this.book.filter((item) => item.id !== id);
    return mockResponse(id);
  }

  setDefault(id: string): Observable<AddressBookEntry[]> {
    this.book = this.book.map((item) => ({ ...item, isDefault: item.id === id }));
    return mockResponse(clone(this.book));
  }
}
