import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type { Agency, AgencyFilters, ApiError } from '../../../core/models';

export const AgencyActions = createActionGroup({
  source: 'Agencies',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ agencies: Agency[] }>(),
    'Load Failure': props<{ error: ApiError }>(),
    'Update Filters': props<{ filters: Partial<AgencyFilters> }>(),
    'Reset Filters': emptyProps(),
    'Set View': props<{ view: 'map' | 'list' }>(),
    Select: props<{ id: string | null }>(),
    'Load Detail': props<{ id: string }>(),
    'Load Detail Success': props<{ agency: Agency }>(),
    'Load Detail Failure': props<{ error: ApiError }>(),
  },
});
