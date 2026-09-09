import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AddressApi } from '../api.contracts';
import { API } from '../api.endpoints';
import type {
  AddressBookEntry,
  AddressBookPayload,
  AddressSuggestion,
  NormalizedAddress,
} from '../../models';

/** Implémentation réelle : back-end postal .NET (qui relaie le référentiel D.A.S). */
@Injectable()
export class AddressHttpApi extends AddressApi {
  private readonly http = inject(HttpClient);

  search(query: string): Observable<AddressSuggestion[]> {
    return this.http.get<AddressSuggestion[]>(API.address.search, {
      params: new HttpParams().set('q', query),
    });
  }

  getById(id: string): Observable<NormalizedAddress> {
    return this.http.get<NormalizedAddress>(API.address.detail(id));
  }

  listBook(): Observable<AddressBookEntry[]> {
    return this.http.get<AddressBookEntry[]>(API.address.book);
  }

  addToBook(payload: AddressBookPayload): Observable<AddressBookEntry> {
    return this.http.post<AddressBookEntry>(API.address.book, payload);
  }

  updateBookEntry(id: string, payload: AddressBookPayload): Observable<AddressBookEntry> {
    return this.http.put<AddressBookEntry>(API.address.bookItem(id), payload);
  }

  removeFromBook(id: string): Observable<string> {
    return this.http.delete<void>(API.address.bookItem(id)).pipe(map(() => id));
  }

  setDefault(id: string): Observable<AddressBookEntry[]> {
    return this.http.put<AddressBookEntry[]>(API.address.bookDefault(id), {});
  }
}
