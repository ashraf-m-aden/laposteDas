import { getRouterSelectors } from '@ngrx/router-store';

/** Sélecteurs de route prêts à l'emploi (params, queryParams, url courante). */
export const {
  selectCurrentRoute,
  selectFragment,
  selectQueryParams,
  selectQueryParam,
  selectRouteParams,
  selectRouteParam,
  selectRouteData,
  selectUrl,
  selectTitle,
} = getRouterSelectors();
