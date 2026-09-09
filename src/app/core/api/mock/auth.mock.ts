import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthApi } from '../api.contracts';
import type {
  AuthSession,
  Credentials,
  HistoryItem,
  ProfilePayload,
  RegisterPayload,
  UserAccount,
} from '../../models';
import { MOCK_HISTORY, MOCK_USERS, buildSession } from '../../mock/mock-account';
import { clone, mockError, mockResponse, uid } from '../../mock/mock.util';

/** Mot de passe unique accepté par le mock. */
const MOCK_PASSWORD = 'demo1234';
/** Le mock persiste l'utilisateur courant pour survivre à un rechargement de page. */
const MOCK_SESSION_KEY = 'lpd.mock-user';

@Injectable()
export class AuthMockApi extends AuthApi {
  private users: UserAccount[] = clone(MOCK_USERS);
  private currentUserId: string | null = readCurrentUserId();

  login(credentials: Credentials): Observable<AuthSession> {
    const user = this.users.find(
      (item) => item.email.toLowerCase() === credentials.email.trim().toLowerCase(),
    );
    if (!user || credentials.password !== MOCK_PASSWORD) {
      return mockError('INVALID_CREDENTIALS', 'E-mail ou mot de passe incorrect.', undefined, 401);
    }
    if (user.status === 'PENDING') {
      return mockError('ACCOUNT_PENDING', 'Compte en attente de validation manuelle.', undefined, 403);
    }
    this.setCurrentUser(user.id);
    return mockResponse(buildSession(clone(user)));
  }

  register(payload: RegisterPayload): Observable<AuthSession> {
    const exists = this.users.some(
      (item) => item.email.toLowerCase() === payload.email.trim().toLowerCase(),
    );
    if (exists) {
      return mockError('EMAIL_ALREADY_USED', 'Un compte existe déjà avec cet e-mail.', undefined, 409);
    }
    const user: UserAccount = {
      id: uid('USR'),
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      phone: payload.phone,
      type: payload.type,
      // Une inscription professionnelle reste en attente de validation manuelle (6.14).
      status: payload.type === 'BUSINESS' ? 'PENDING' : 'ACTIVE',
      companyName: payload.companyName,
      legalId: payload.legalId,
      preferences: {
        language: 'fr',
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: false,
      },
    };
    this.users = [...this.users, user];
    this.setCurrentUser(user.id);
    return mockResponse(buildSession(clone(user)));
  }

  me(): Observable<UserAccount> {
    const user = this.users.find((item) => item.id === this.currentUserId);
    return user
      ? mockResponse(clone(user))
      : mockError('SESSION_EXPIRED', 'Session expirée, merci de vous reconnecter.', undefined, 401);
  }

  updateProfile(payload: ProfilePayload): Observable<UserAccount> {
    const user = this.users.find((item) => item.id === this.currentUserId);
    if (!user) {
      return mockError('SESSION_EXPIRED', 'Session expirée.', undefined, 401);
    }
    Object.assign(user, {
      firstName: payload.firstName,
      lastName: payload.lastName,
      phone: payload.phone,
      preferences: payload.preferences,
    });
    return mockResponse(clone(user));
  }

  history(): Observable<HistoryItem[]> {
    return mockResponse(clone(MOCK_HISTORY));
  }

  logout(): Observable<void> {
    this.setCurrentUser(null);
    return mockResponse(undefined as void);
  }

  private setCurrentUser(id: string | null): void {
    this.currentUserId = id;
    try {
      if (id) {
        localStorage.setItem(MOCK_SESSION_KEY, id);
      } else {
        localStorage.removeItem(MOCK_SESSION_KEY);
      }
    } catch {
      /* stockage indisponible : session en mémoire uniquement */
    }
  }
}

function readCurrentUserId(): string | null {
  try {
    return localStorage.getItem(MOCK_SESSION_KEY);
  } catch {
    return null;
  }
}
