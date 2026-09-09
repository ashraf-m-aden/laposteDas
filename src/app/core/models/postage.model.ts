export type PostageCategory = 'STAMP' | 'ENVELOPE' | 'PACK' | 'COLLECTION';

/** Produit d'affranchissement (6.8). */
export interface PostageProduct {
  id: string;
  name: string;
  category: PostageCategory;
  description: string;
  unitPrice: number;
  currency: string;
  available: boolean;
  icon: string;
}

export interface PostageQuoteRequest {
  productId: string;
  destinationAddressId: string;
  weightGrams: number;
  quantity: number;
}

export interface PostageQuote {
  productId: string;
  productName: string;
  quantity: number;
  weightGrams: number;
  destinationLabel: string;
  amount: number;
  currency: string;
  computedAt: string;
}

export type PaymentMethod = 'CARD' | 'MOBILE_MONEY' | 'ACCOUNT';

export interface PaymentPayload {
  quote: PostageQuote;
  method: PaymentMethod;
}

/** Justificatif d'affranchissement généré (6.10). */
export interface PostageLabel {
  id: string;
  reference: string;
  productName: string;
  amount: number;
  currency: string;
  issuedAt: string;
  documentUrl: string;
  qrData: string;
}
