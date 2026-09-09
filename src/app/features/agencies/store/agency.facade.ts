import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import type { AgencyFilters } from '../../../core/models';
import { AgencyActions } from './agency.actions';
import {
  selectAgencyCount,
  selectAgencyError,
  selectAgencyFilters,
  selectAgencyStatus,
  selectAgencyView,
  selectAllAgencies,
  selectMapCenter,
  selectOpenAgenciesCount,
  selectSelectedAgency,
} from './agency.selectors';

@Injectable({ providedIn: 'root' })
export class AgencyFacade {
  private readonly store = inject(Store);

  readonly agencies = toSignal(this.store.select(selectAllAgencies), { initialValue: [] });
  readonly status = toSignal(this.store.select(selectAgencyStatus), { initialValue: 'idle' as const });
  readonly error = toSignal(this.store.select(selectAgencyError), { initialValue: null });
  readonly filters = toSignal(this.store.select(selectAgencyFilters), {
    initialValue: { query: '', service: null, openOnly: false, sortBy: 'distance' } as AgencyFilters,
  });
  readonly view = toSignal(this.store.select(selectAgencyView), { initialValue: 'list' as const });
  readonly count = toSignal(this.store.select(selectAgencyCount), { initialValue: 0 });
  readonly openCount = toSignal(this.store.select(selectOpenAgenciesCount), { initialValue: 0 });
  readonly selected = toSignal(this.store.select(selectSelectedAgency), { initialValue: null });
  readonly mapCenter = toSignal(this.store.select(selectMapCenter), {
    initialValue: { latitude: 11.5721, longitude: 43.1456 },
  });

  load(): void {
    this.store.dispatch(AgencyActions.load());
  }

  updateFilters(filters: Partial<AgencyFilters>): void {
    this.store.dispatch(AgencyActions.updateFilters({ filters }));
  }

  resetFilters(): void {
    this.store.dispatch(AgencyActions.resetFilters());
  }

  setView(view: 'map' | 'list'): void {
    this.store.dispatch(AgencyActions.setView({ view }));
  }

  select(id: string | null): void {
    this.store.dispatch(AgencyActions.select({ id }));
  }

  loadDetail(id: string): void {
    this.store.dispatch(AgencyActions.loadDetail({ id }));
  }
}
