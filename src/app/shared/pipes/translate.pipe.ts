import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';
import type { Language } from '../../core/models';

/**
 * Usage : {{ 'nav.home' | t }}.
 * Le pipe est impur : un pipe pur ne serait jamais réévalué au changement de
 * langue puisque sa clé ne change pas. La mémoïsation interne évite tout
 * recalcul tant que la langue et la clé sont identiques.
 */
@Pipe({ name: 't', pure: false })
export class TranslatePipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  private lastKey: string | null = null;
  private lastLanguage: Language | null = null;
  private lastValue = '';

  transform(key: string): string {
    const language = this.i18n.language();
    if (key === this.lastKey && language === this.lastLanguage) {
      return this.lastValue;
    }
    this.lastKey = key;
    this.lastLanguage = language;
    this.lastValue = this.i18n.translate(key);
    return this.lastValue;
  }
}
