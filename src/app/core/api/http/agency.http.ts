import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AgencyApi } from '../api.contracts';
import { API } from '../api.endpoints';
import type { Agency, AgencyFilters } from '../../models';

@Injectable()
export class AgencyHttpApi extends AgencyApi {
  private readonly http = inject(HttpClient);

  list(filters: AgencyFilters): Observable<Agency[]> {
    let params = new HttpParams().set('sortBy', filters.sortBy);
    if (filters.query) {
      params = params.set('q', filters.query);
    }
    if (filters.service) {
      params = params.set('service', filters.service);
    }
    if (filters.openOnly) {
      params = params.set('openOnly', 'true');
    }
    return this.http.get<Agency[]>(API.agency.list, { params });
  }

  getById(id: string): Observable<Agency> {
    return this.http.get<Agency>(API.agency.detail(id));
  }
}
