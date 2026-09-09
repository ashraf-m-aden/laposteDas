import { createSelector } from '@ngrx/store';
import { agencyAdapter } from './agency.state';
import { agencyFeature } from './agency.reducer';

const { selectAll, selectEntities, selectTotal } = agencyAdapter.getSelectors();

export const selectAgencyState = agencyFeature.selectAgenciesState;
export const selectAgencyStatus = agencyFeature.selectStatus;
export const selectAgencyError = agencyFeature.selectError;
export const selectAgencyFilters = agencyFeature.selectFilters;
export const selectAgencyView = agencyFeature.selectView;
export const selectSelectedAgencyId = agencyFeature.selectSelectedId;

export const selectAllAgencies = createSelector(selectAgencyState, selectAll);
export const selectAgencyEntities = createSelector(selectAgencyState, selectEntities);
export const selectAgencyCount = createSelector(selectAgencyState, selectTotal);

export const selectSelectedAgency = createSelector(
  selectAgencyEntities,
  selectSelectedAgencyId,
  (entities, id) => (id ? (entities[id] ?? null) : null),
);

export const selectOpenAgenciesCount = createSelector(
  selectAllAgencies,
  (agencies) => agencies.filter((agency) => agency.isOpenNow).length,
);

/** Centre de carte approximatif : barycentre des agences affichées. */
export const selectMapCenter = createSelector(selectAllAgencies, (agencies) => {
  if (!agencies.length) {
    return { latitude: 11.5721, longitude: 43.1456 };
  }
  const sum = agencies.reduce(
    (acc, agency) => ({
      latitude: acc.latitude + agency.address.latitude,
      longitude: acc.longitude + agency.address.longitude,
    }),
    { latitude: 0, longitude: 0 },
  );
  return {
    latitude: sum.latitude / agencies.length,
    longitude: sum.longitude / agencies.length,
  };
});
