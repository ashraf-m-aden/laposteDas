import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ShippingApi } from '../api.contracts';
import { API } from '../api.endpoints';
import type { BusinessRate, QuoteRequest, ServiceOffer, Shipment, ShipmentPayload } from '../../models';

@Injectable()
export class ShippingHttpApi extends ShippingApi {
  private readonly http = inject(HttpClient);

  quotes(request: QuoteRequest): Observable<ServiceOffer[]> {
    return this.http.post<ServiceOffer[]>(API.shipping.quotes, request);
  }

  create(payload: ShipmentPayload): Observable<Shipment> {
    return this.http.post<Shipment>(API.shipping.create, payload);
  }

  list(): Observable<Shipment[]> {
    return this.http.get<Shipment[]>(API.shipping.list);
  }

  rates(): Observable<BusinessRate[]> {
    return this.http.get<BusinessRate[]>(API.shipping.rates);
  }
}
