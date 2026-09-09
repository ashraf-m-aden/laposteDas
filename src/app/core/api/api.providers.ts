import { AbstractType, Provider, Type } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  AddressApi,
  AgencyApi,
  AuthApi,
  NotificationApi,
  PostageApi,
  ShippingApi,
  SupportApi,
  TrackingApi,
} from './api.contracts';
import { AddressHttpApi } from './http/address.http';
import { AgencyHttpApi } from './http/agency.http';
import { AuthHttpApi } from './http/auth.http';
import { NotificationHttpApi } from './http/notification.http';
import { PostageHttpApi } from './http/postage.http';
import { ShippingHttpApi } from './http/shipping.http';
import { SupportHttpApi } from './http/support.http';
import { TrackingHttpApi } from './http/tracking.http';
import { AddressMockApi } from './mock/address.mock';
import { AgencyMockApi } from './mock/agency.mock';
import { AuthMockApi } from './mock/auth.mock';
import { NotificationMockApi } from './mock/notification.mock';
import { PostageMockApi } from './mock/postage.mock';
import { ShippingMockApi } from './mock/shipping.mock';
import { SupportMockApi } from './mock/support.mock';
import { TrackingMockApi } from './mock/tracking.mock';

/** Couple contrat -> (implémentation mock, implémentation HTTP). */
const API_BINDINGS: ReadonlyArray<[AbstractType<unknown>, Type<unknown>, Type<unknown>]> = [
  [AuthApi, AuthMockApi, AuthHttpApi],
  [AddressApi, AddressMockApi, AddressHttpApi],
  [TrackingApi, TrackingMockApi, TrackingHttpApi],
  [AgencyApi, AgencyMockApi, AgencyHttpApi],
  [ShippingApi, ShippingMockApi, ShippingHttpApi],
  [PostageApi, PostageMockApi, PostageHttpApi],
  [NotificationApi, NotificationMockApi, NotificationHttpApi],
  [SupportApi, SupportMockApi, SupportHttpApi],
];

/**
 * Câblage backend : une seule bascule, `environment.useMock`.
 * - true  -> données factices en mémoire, aucun appel réseau ;
 * - false -> back-end postal .NET via HttpClient (URLs dans `api.endpoints.ts`).
 * Les effects, facades et composants sont strictement identiques dans les deux cas.
 */
export function provideApiLayer(): Provider[] {
  return API_BINDINGS.map(([contract, mockImpl, httpImpl]) => ({
    provide: contract,
    useClass: environment.useMock ? mockImpl : httpImpl,
  }));
}
