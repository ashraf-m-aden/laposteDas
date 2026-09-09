import { createFeature, createReducer, on } from '@ngrx/store';
import { AgencyActions } from './agency.actions';
import { agencyAdapter, AGENCY_FEATURE_KEY, initialAgencyFilters, initialAgencyState } from './agency.state';

export const agencyFeature = createFeature({
  name: AGENCY_FEATURE_KEY,
  reducer: createReducer(
    initialAgencyState,
    on(AgencyActions.load, AgencyActions.loadDetail, (state) => ({
      ...state,
      status: 'loading' as const,
      error: null,
    })),
    on(AgencyActions.loadSuccess, (state, { agencies }) =>
      agencyAdapter.setAll(agencies, {
        ...state,
        status: agencies.length ? ('loaded' as const) : ('empty' as const),
      }),
    ),
    on(AgencyActions.loadDetailSuccess, (state, { agency }) =>
      agencyAdapter.upsertOne(agency, {
        ...state,
        status: 'loaded' as const,
        selectedId: agency.id,
      }),
    ),
    on(AgencyActions.loadFailure, AgencyActions.loadDetailFailure, (state, { error }) => ({
      ...state,
      status: 'error' as const,
      error,
    })),
    on(AgencyActions.updateFilters, (state, { filters }) => ({
      ...state,
      filters: { ...state.filters, ...filters },
    })),
    on(AgencyActions.resetFilters, (state) => ({ ...state, filters: initialAgencyFilters })),
    on(AgencyActions.setView, (state, { view }) => ({ ...state, view })),
    on(AgencyActions.select, (state, { id }) => ({ ...state, selectedId: id })),
  ),
});
