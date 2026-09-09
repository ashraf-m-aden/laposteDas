import { Pipe, PipeTransform } from '@angular/core';

/** Formatage monétaire local : 1 500 DJF. */
@Pipe({ name: 'djf' })
export class DjfPipe implements PipeTransform {
  transform(amount: number | null | undefined, currency = 'DJF'): string {
    if (amount === null || amount === undefined) {
      return '';
    }
    return `${new Intl.NumberFormat('fr-FR').format(amount)} ${currency}`;
  }
}
