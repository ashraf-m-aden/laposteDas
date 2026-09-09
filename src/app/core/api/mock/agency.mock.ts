import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AgencyApi } from '../api.contracts';
import type { Agency, AgencyFilters } from '../../models';
import { MOCK_AGENCIES } from '../../mock/mock-agencies';
import { clone, mockError, mockResponse } from '../../mock/mock.util';

@Injectable()
export class AgencyMockApi extends AgencyApi {
  list(filters: AgencyFilters): Observable<Agency[]> {
    const needle = filters.query.trim().toLowerCase();
    const result = MOCK_AGENCIES.filter((agency) => {
      const matchesQuery =
        !needle ||
        `${agency.name} ${agency.address.formatted}`.toLowerCase().includes(needle);
      const matchesService = !filters.service || agency.services.includes(filters.service);
      const matchesOpen = !filters.openOnly || agency.isOpenNow;
      return matchesQuery && matchesService && matchesOpen;
    }).sort((a, b) =>
      filters.sortBy === 'name' ? a.name.localeCompare(b.name) : a.distanceKm - b.distanceKm,
    );
    return mockResponse(clone(result));
  }

  getById(id: string): Observable<Agency> {
    const agency = MOCK_AGENCIES.find((item) => item.id === id);
    return agency
      ? mockResponse(clone(agency))
      : mockError('AGENCY_NOT_FOUND', 'Agence introuvable.', undefined, 404);
  }
}
