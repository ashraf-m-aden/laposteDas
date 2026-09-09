import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TrackingApi } from '../api.contracts';
import type { Parcel } from '../../models';
import { MOCK_PARCELS } from '../../mock/mock-parcels';
import { clone, mockError, mockResponse } from '../../mock/mock.util';

@Injectable()
export class TrackingMockApi extends TrackingApi {
  private parcels: Parcel[] = clone(MOCK_PARCELS);

  track(trackingNumber: string): Observable<Parcel> {
    const parcel = this.parcels.find(
      (item) => item.trackingNumber.toUpperCase() === trackingNumber.trim().toUpperCase(),
    );
    return parcel
      ? mockResponse(clone(parcel))
      : mockError(
          'PARCEL_NOT_FOUND',
          `Aucun colis ne correspond au numéro ${trackingNumber.toUpperCase()}.`,
          undefined,
          404,
        );
  }

  subscribeNotifications(trackingNumber: string, enabled: boolean): Observable<Parcel> {
    const parcel = this.parcels.find((item) => item.trackingNumber === trackingNumber);
    if (!parcel) {
      return mockError('PARCEL_NOT_FOUND', 'Colis introuvable.', undefined, 404);
    }
    parcel.notificationsEnabled = enabled;
    return mockResponse(clone(parcel));
  }
}
