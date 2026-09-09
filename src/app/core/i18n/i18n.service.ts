import { Injectable, computed, inject } from '@angular/core';
import { UiFacade } from '../../store/ui/ui.facade';
import { TRANSLATIONS } from './translations';

/** Traduction pilotée par la langue stockée dans le store `ui`. */
@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly ui = inject(UiFacade);

  readonly language = this.ui.language;
  private readonly dictionary = computed(() => TRANSLATIONS[this.language()]);

  translate(key: string): string {
    return this.dictionary()[key] ?? key;
  }
}
