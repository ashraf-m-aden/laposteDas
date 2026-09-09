import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ShippingApi } from '../api.contracts';
import type { BusinessRate, QuoteRequest, ServiceOffer, Shipment, ShipmentPayload } from '../../models';
import { MOCK_BUSINESS_RATES, MOCK_SERVICE_OFFERS } from '../../mock/mock-catalog';
import { MOCK_SHIPMENTS } from '../../mock/mock-account';
import { MOCK_ADDRESSES } from '../../mock/mock-addresses';
import { clone, isoDaysFromNow, mockError, mockResponse, uid } from '../../mock/mock.util';

@Injectable()
export class ShippingMockApi extends ShippingApi {
  private shipments: Shipment[] = clone(MOCK_SHIPMENTS);

  /** Tarification factice : prix de base + majoration au poids et au volume. */
  quotes(request: QuoteRequest): Observable<ServiceOffer[]> {
    const destination = MOCK_ADDRESSES.find((item) => item.id === request.destinationAddressId);
    if (!destination) {
      return mockError('ADDRESS_NOT_VALIDATED', 'Destination non validée.');
    }
    const { weightKg, lengthCm, widthCm, heightCm } = request.parcel;
    const volumeFactor = (lengthCm * widthCm * heightCm) / 5000;
    const billableWeight = Math.max(weightKg, volumeFactor);
    const isInternational = destination.country !== 'Djibouti';
    const isOutOfZone = destination.status === 'OUT_OF_ZONE';

    const offers = MOCK_SERVICE_OFFERS.map((offer) => {
      const price = Math.round(offer.price + billableWeight * 180);
      const available =
        offer.code === 'INT' ? isInternational : offer.available && !isOutOfZone;
      const unavailableReason = !available
        ? offer.code === 'INT'
          ? 'Non éligible pour une destination nationale.'
          : 'Zone hors couverture de livraison à domicile.'
        : undefined;
      return { ...clone(offer), price, available, unavailableReason };
    });
    return mockResponse(offers);
  }

  create(payload: ShipmentPayload): Observable<Shipment> {
    const offer = MOCK_SERVICE_OFFERS.find((item) => item.code === payload.serviceCode);
    if (!offer) {
      return mockError('SERVICE_UNAVAILABLE', 'Prestation indisponible.');
    }
    const options = offer.options.filter((option) => payload.optionCodes.includes(option.code));
    const price =
      offer.price +
      Math.round(payload.parcel.weightKg * 180) +
      options.reduce((total, option) => total + option.price, 0);

    const shipment: Shipment = {
      id: uid('SHP'),
      trackingNumber: `LP${Math.floor(100000000 + Math.random() * 899999999)}DJ`,
      sender: payload.sender,
      recipient: payload.recipient,
      parcel: payload.parcel,
      serviceLabel: offer.label,
      optionLabels: options.map((option) => option.label),
      price,
      currency: offer.currency,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      pickupDate: isoDaysFromNow(1, 10),
    };
    this.shipments = [shipment, ...this.shipments];
    return mockResponse(clone(shipment));
  }

  list(): Observable<Shipment[]> {
    return mockResponse(clone(this.shipments));
  }

  rates(): Observable<BusinessRate[]> {
    return mockResponse(clone(MOCK_BUSINESS_RATES));
  }
}
