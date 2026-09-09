import { Pipe, PipeTransform } from '@angular/core';

type Tone = 'success' | 'warning' | 'danger' | 'neutral' | '';

const TONES: Record<string, Tone> = {
  DELIVERED: 'success',
  VALIDATED: 'success',
  ACTIVE: 'success',
  RESOLVED: 'success',
  OUT_FOR_DELIVERY: '',
  IN_TRANSIT: '',
  IN_PROGRESS: '',
  SORTING_CENTER: 'neutral',
  CREATED: 'neutral',
  PENDING: 'warning',
  OPEN: 'warning',
  UNVERIFIED: 'warning',
  EXCEPTION: 'danger',
  CANCELLED: 'danger',
  REJECTED: 'danger',
  NOT_FOUND: 'danger',
  OUT_OF_ZONE: 'danger',
};

/** Renvoie la classe modificatrice du badge : `lp-badge--{tone}`. */
@Pipe({ name: 'statusTone' })
export class StatusTonePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }
    const tone = TONES[value] ?? 'neutral';
    return tone ? `lp-badge--${tone}` : '';
  }
}
