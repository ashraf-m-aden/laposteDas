import { EntityState, createEntityAdapter } from '@ngrx/entity';
import type { Agency, AgencyFilters, ApiError, ViewStatus } from '../../../core/models';

export const AGENCY_FEATURE_KEY = 'agencies';

export interface AgencyState extends EntityState<Agency> {
  filters: AgencyFilters;
  status: ViewStatus;
  error: ApiError | null;
  selectedId: string | null;
  /** 6.11 carte / 6.12 liste : deux vues du même jeu de données. */
  view: 'map' | 'list';
}

export const agencyAdapter = createEntityAdapter<Agency>({
  selectId: (agency) => agency.id,
  sortComparer: false,
});

export const initialAgencyFilters: AgencyFilters = {
  query: '',
  service: null,
  openOnly: false,
  sortBy: 'distance',
};

export const initialAgencyState: AgencyState = agencyAdapter.getInitialState({
  filters: initialAgencyFilters,
  status: 'idle' as ViewStatus,
  error: null,
  selectedId: null,
  view: 'list' as const,
});
