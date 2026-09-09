import { Observable } from 'rxjs';
import type {
  AddressBookEntry,
  BusinessRate,
  AddressBookPayload,
  Agency,
  AgencyFilters,
  AppNotification,
  AuthSession,
  Credentials,
  FaqArticle,
  HistoryItem,
  NormalizedAddress,
  AddressSuggestion,
  Parcel,
  PaymentPayload,
  PostageLabel,
  PostageProduct,
  PostageQuote,
  PostageQuoteRequest,
  ProfilePayload,
  QuoteRequest,
  RegisterPayload,
  ServiceOffer,
  Shipment,
  ShipmentPayload,
  Ticket,
  TicketPayload,
  UserAccount,
} from '../models';

/**
 * Contrats de la couche API (jetons d'injection).
 * Deux implémentations : `*MockApi` (données factices) et `*HttpApi` (back-end .NET).
 * Le choix se fait dans `provideApiLayer()` selon `environment.useMock`.
 */

export abstract class AuthApi {
  abstract login(credentials: Credentials): Observable<AuthSession>;
  abstract register(payload: RegisterPayload): Observable<AuthSession>;
  abstract me(): Observable<UserAccount>;
  abstract updateProfile(payload: ProfilePayload): Observable<UserAccount>;
  abstract history(): Observable<HistoryItem[]>;
  abstract logout(): Observable<void>;
}

export abstract class AddressApi {
  abstract search(query: string): Observable<AddressSuggestion[]>;
  abstract getById(id: string): Observable<NormalizedAddress>;
  abstract listBook(): Observable<AddressBookEntry[]>;
  abstract addToBook(payload: AddressBookPayload): Observable<AddressBookEntry>;
  abstract updateBookEntry(id: string, payload: AddressBookPayload): Observable<AddressBookEntry>;
  abstract removeFromBook(id: string): Observable<string>;
  abstract setDefault(id: string): Observable<AddressBookEntry[]>;
}

export abstract class TrackingApi {
  abstract track(trackingNumber: string): Observable<Parcel>;
  abstract subscribeNotifications(trackingNumber: string, enabled: boolean): Observable<Parcel>;
}

export abstract class AgencyApi {
  abstract list(filters: AgencyFilters): Observable<Agency[]>;
  abstract getById(id: string): Observable<Agency>;
}

export abstract class ShippingApi {
  abstract quotes(request: QuoteRequest): Observable<ServiceOffer[]>;
  abstract create(payload: ShipmentPayload): Observable<Shipment>;
  abstract list(): Observable<Shipment[]>;
  abstract rates(): Observable<BusinessRate[]>;
}

export abstract class PostageApi {
  abstract products(): Observable<PostageProduct[]>;
  abstract quote(request: PostageQuoteRequest): Observable<PostageQuote>;
  abstract pay(payload: PaymentPayload): Observable<PostageLabel>;
}

export abstract class NotificationApi {
  abstract list(): Observable<AppNotification[]>;
  abstract markAsRead(id: string): Observable<AppNotification>;
  abstract markAllAsRead(): Observable<AppNotification[]>;
}

export abstract class SupportApi {
  abstract faq(): Observable<FaqArticle[]>;
  abstract tickets(): Observable<Ticket[]>;
  abstract createTicket(payload: TicketPayload): Observable<Ticket>;
  abstract replyTicket(id: string, body: string): Observable<Ticket>;
}
