import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PostageApi } from '../api.contracts';
import { API } from '../api.endpoints';
import type {
  PaymentPayload,
  PostageLabel,
  PostageProduct,
  PostageQuote,
  PostageQuoteRequest,
} from '../../models';

@Injectable()
export class PostageHttpApi extends PostageApi {
  private readonly http = inject(HttpClient);

  products(): Observable<PostageProduct[]> {
    return this.http.get<PostageProduct[]>(API.postage.products);
  }

  quote(request: PostageQuoteRequest): Observable<PostageQuote> {
    return this.http.post<PostageQuote>(API.postage.quote, request);
  }

  pay(payload: PaymentPayload): Observable<PostageLabel> {
    return this.http.post<PostageLabel>(API.postage.pay, payload);
  }
}
