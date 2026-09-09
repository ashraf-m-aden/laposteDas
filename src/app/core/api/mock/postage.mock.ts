import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostageApi } from '../api.contracts';
import type {
  PaymentPayload,
  PostageLabel,
  PostageProduct,
  PostageQuote,
  PostageQuoteRequest,
} from '../../models';
import { MOCK_POSTAGE_PRODUCTS } from '../../mock/mock-catalog';
import { MOCK_ADDRESSES } from '../../mock/mock-addresses';
import { clone, mockError, mockResponse, uid } from '../../mock/mock.util';

@Injectable()
export class PostageMockApi extends PostageApi {
  products(): Observable<PostageProduct[]> {
    return mockResponse(clone(MOCK_POSTAGE_PRODUCTS));
  }

  quote(request: PostageQuoteRequest): Observable<PostageQuote> {
    const product = MOCK_POSTAGE_PRODUCTS.find((item) => item.id === request.productId);
    const destination = MOCK_ADDRESSES.find((item) => item.id === request.destinationAddressId);
    if (!product) {
      return mockError('PRODUCT_NOT_FOUND', 'Produit introuvable.', undefined, 404);
    }
    if (!product.available) {
      return mockError('PRODUCT_UNAVAILABLE', 'Ce produit est momentanément indisponible.');
    }
    if (!destination) {
      return mockError('ADDRESS_NOT_VALIDATED', 'Destination non validée : tarif non calculable.');
    }
    const weightSurcharge = Math.max(0, Math.ceil((request.weightGrams - 20) / 20)) * 25;
    const amount = (product.unitPrice + weightSurcharge) * request.quantity;
    const quote: PostageQuote = {
      productId: product.id,
      productName: product.name,
      quantity: request.quantity,
      weightGrams: request.weightGrams,
      destinationLabel: destination.formatted,
      amount,
      currency: product.currency,
      computedAt: new Date().toISOString(),
    };
    return mockResponse(quote);
  }

  pay(payload: PaymentPayload): Observable<PostageLabel> {
    if (payload.method === 'ACCOUNT' && payload.quote.amount > 10000) {
      return mockError('PAYMENT_REFUSED', 'Plafond du compte dépassé pour ce paiement.', undefined, 402);
    }
    const reference = `AFF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 8999)}`;
    const label: PostageLabel = {
      id: uid('LBL'),
      reference,
      productName: payload.quote.productName,
      amount: payload.quote.amount,
      currency: payload.quote.currency,
      issuedAt: new Date().toISOString(),
      documentUrl: `#/mock/labels/${reference}.pdf`,
      qrData: `LPD|${reference}|${payload.quote.amount}${payload.quote.currency}`,
    };
    return mockResponse(label);
  }
}
