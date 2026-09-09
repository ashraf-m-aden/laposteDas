/**
 * Contrat d'endpoints du back-end postal .NET.
 * C'est le SEUL endroit où les URLs sont décrites : la documentation technique
 * dédiée (hors cahier des charges) viendra confirmer/ajuster ces chemins.
 * Les URLs sont relatives : `ApiUrlInterceptor` préfixe avec `environment.apiUrl`.
 */
export const API = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    forgotPassword: '/auth/forgot-password',
    me: '/account/me',
    profile: '/account/profile',
    history: '/account/history',
  },
  address: {
    search: '/addresses/search',
    detail: (id: string) => `/addresses/${id}`,
    validate: '/addresses/validate',
    book: '/account/address-book',
    bookItem: (id: string) => `/account/address-book/${id}`,
    bookDefault: (id: string) => `/account/address-book/${id}/default`,
  },
  tracking: {
    byNumber: (trackingNumber: string) => `/tracking/${trackingNumber}`,
    subscribe: (trackingNumber: string) => `/tracking/${trackingNumber}/notifications`,
  },
  agency: {
    list: '/agencies',
    detail: (id: string) => `/agencies/${id}`,
  },
  shipping: {
    quotes: '/shipments/quotes',
    create: '/shipments',
    list: '/shipments',
    rates: '/shipments/rates',
    detail: (id: string) => `/shipments/${id}`,
  },
  postage: {
    products: '/postage/products',
    quote: '/postage/quote',
    pay: '/postage/payments',
    label: (id: string) => `/postage/labels/${id}`,
  },
  notification: {
    list: '/notifications',
    read: (id: string) => `/notifications/${id}/read`,
    readAll: '/notifications/read-all',
  },
  support: {
    faq: '/support/faq',
    tickets: '/support/tickets',
    ticketReply: (id: string) => `/support/tickets/${id}/messages`,
  },
} as const;
