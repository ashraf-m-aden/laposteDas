import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthApi } from '../api.contracts';
import { API } from '../api.endpoints';
import type {
  AuthSession,
  Credentials,
  HistoryItem,
  ProfilePayload,
  RegisterPayload,
  UserAccount,
} from '../../models';

@Injectable()
export class AuthHttpApi extends AuthApi {
  private readonly http = inject(HttpClient);

  login(credentials: Credentials): Observable<AuthSession> {
    return this.http.post<AuthSession>(API.auth.login, credentials);
  }

  register(payload: RegisterPayload): Observable<AuthSession> {
    return this.http.post<AuthSession>(API.auth.register, payload);
  }

  me(): Observable<UserAccount> {
    return this.http.get<UserAccount>(API.auth.me);
  }

  updateProfile(payload: ProfilePayload): Observable<UserAccount> {
    return this.http.put<UserAccount>(API.auth.profile, payload);
  }

  history(): Observable<HistoryItem[]> {
    return this.http.get<HistoryItem[]>(API.auth.history);
  }

  logout(): Observable<void> {
    return this.http.post<void>(API.auth.logout, {});
  }
}
