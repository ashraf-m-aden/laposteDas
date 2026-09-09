import { Observable, delay, of, throwError, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import type { ApiError } from '../models';

/** Simule un appel réseau réussi vers le back-end postal. */
export function mockResponse<T>(value: T, latency = environment.mockLatencyMs): Observable<T> {
  if (environment.mockErrorRate > 0 && Math.random() < environment.mockErrorRate) {
    return mockError('MOCK_RANDOM_FAILURE', 'Le service est momentanément indisponible.', latency);
  }
  return of(value).pipe(delay(latency));
}

/** Simule une erreur métier renvoyée par le back-end postal. */
export function mockError<T>(
  code: string,
  message: string,
  latency = environment.mockLatencyMs,
  status = 400,
): Observable<T> {
  const error: ApiError = { code, message, status };
  return timer(latency).pipe(mergeMap(() => throwError(() => error)));
}

/** Copie défensive : le store ne doit jamais muter la base factice. */
export function clone<T>(value: T): T {
  return structuredClone(value);
}

export function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9).toUpperCase()}`;
}

export function isoDaysFromNow(days: number, hours = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(date.getHours() + hours, 0, 0, 0);
  return date.toISOString();
}
