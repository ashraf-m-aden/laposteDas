import { Pipe, PipeTransform } from '@angular/core';

const LABELS: Record<string, string> = {
  // Colis / suivi
  CREATED: 'Envoi enregistré',
  IN_TRANSIT: 'En transit',
  SORTING_CENTER: 'Centre de tri',
  OUT_FOR_DELIVERY: 'En cours de livraison',
  DELIVERED: 'Livré',
  EXCEPTION: 'Incident',
  // Expéditions
  PENDING: 'En attente',
  IN_PROGRESS: 'En cours',
  CANCELLED: 'Annulée',
  // Adresses
  VALIDATED: 'Adresse validée',
  UNVERIFIED: 'Non vérifiée',
  NOT_FOUND: 'Adresse introuvable',
  OUT_OF_ZONE: 'Hors zone de couverture',
  // Comptes / demandes
  ACTIVE: 'Actif',
  REJECTED: 'Rejeté',
  OPEN: 'Ouverte',
  RESOLVED: 'Résolue',
};

@Pipe({ name: 'statusLabel' })
export class StatusLabelPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }
    return LABELS[value] ?? value;
  }
}
