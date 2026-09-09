import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

/** Persistance locale du jeton de session (localStorage). */
@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private readonly key = environment.storageKeys.token;

  getToken(): string | null {
    try {
      return localStorage.getItem(this.key);
    } catch {
      return null;
    }
  }

  setToken(token: string): void {
    try {
      localStorage.setItem(this.key, token);
    } catch {
      /* stockage indisponible : session en mémoire uniquement */
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(this.key);
    } catch {
      /* rien à nettoyer */
    }
  }
}
