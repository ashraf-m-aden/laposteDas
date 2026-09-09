/** Erreur normalisée renvoyée par la couche API (mock comme HTTP). */
export interface ApiError {
  code: string;
  message: string;
  status?: number;
  details?: Record<string, string>;
}

/** Page générique renvoyée par le back-end postal. */
export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type Language = 'fr' | 'en';

/** États UI standardisés exigés par le cahier des charges (section 8). */
export type ViewStatus = 'idle' | 'loading' | 'loaded' | 'empty' | 'error';
