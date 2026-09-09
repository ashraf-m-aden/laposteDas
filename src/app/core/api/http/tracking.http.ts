import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TrackingApi } from '../api.contracts';
import { API } from '../api.endpoints';
import type { Parcel } from '../../models';

@Injectable()
export class TrackingHttpApi extends TrackingApi {
  private readonly http = inject(HttpClient);

  track(trackingNumber: string): Observable<Parcel> {
    return this.http.get<Parcel>(API.tracking.byNumber(trackingNumber));
  }

  subscribeNotifications(trackingNumber: string, enabled: boolean): Observable<Parcel> {
    return this.http.put<Parcel>(API.tracking.subscribe(trackingNumber), { enabled });
  }
}
