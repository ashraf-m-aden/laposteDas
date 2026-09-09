import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type { Language } from '../../core/models';

export const UiActions = createActionGroup({
  source: 'UI',
  events: {
    'Restore Language': props<{ language: Language }>(),
    'Set Language': props<{ language: Language }>(),
    'Toggle Mobile Menu': emptyProps(),
    'Close Mobile Menu': emptyProps(),
    'Connection Changed': props<{ online: boolean }>(),
  },
});
