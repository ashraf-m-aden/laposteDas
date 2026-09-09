import type { Parcel } from '../models';
import { MOCK_ADDRESSES } from './mock-addresses';
import { isoDaysFromNow } from './mock.util';

/** Colis factices. Numéros valides pour la démo : LP123456789DJ, LP987654321DJ, LP555000111DJ. */
export const MOCK_PARCELS: Parcel[] = [
  {
    trackingNumber: 'LP123456789DJ',
    status: 'OUT_FOR_DELIVERY',
    serviceLabel: 'Colis Express national',
    weightKg: 2.4,
    origin: MOCK_ADDRESSES[7],
    destination: MOCK_ADDRESSES[0],
    estimatedDeliveryDate: isoDaysFromNow(0, 6),
    notificationsEnabled: false,
    events: [
      {
        id: 'EVT-1',
        status: 'CREATED',
        label: 'Envoi enregistré',
        location: 'Agence Boulaos, Djibouti-Ville',
        occurredAt: isoDaysFromNow(-3, 9),
      },
      {
        id: 'EVT-2',
        status: 'SORTING_CENTER',
        label: 'Arrivé au centre de tri',
        location: 'Centre de tri national, Djibouti-Ville',
        occurredAt: isoDaysFromNow(-2, 11),
      },
      {
        id: 'EVT-3',
        status: 'IN_TRANSIT',
        label: 'En transit',
        location: 'Djibouti-Ville',
        occurredAt: isoDaysFromNow(-1, 8),
      },
      {
        id: 'EVT-4',
        status: 'OUT_FOR_DELIVERY',
        label: 'En cours de livraison',
        location: 'Plateau du Serpent, Djibouti-Ville',
        occurredAt: isoDaysFromNow(0, 7),
        comment: 'Le facteur passe dans la journée.',
      },
    ],
  },
  {
    trackingNumber: 'LP987654321DJ',
    status: 'DELIVERED',
    serviceLabel: 'Colis Standard national',
    weightKg: 0.8,
    origin: MOCK_ADDRESSES[1],
    destination: MOCK_ADDRESSES[4],
    estimatedDeliveryDate: isoDaysFromNow(-1, 10),
    notificationsEnabled: true,
    events: [
      {
        id: 'EVT-5',
        status: 'CREATED',
        label: 'Envoi enregistré',
        location: 'Agence Centrale, Djibouti-Ville',
        occurredAt: isoDaysFromNow(-6, 10),
      },
      {
        id: 'EVT-6',
        status: 'SORTING_CENTER',
        label: 'Traité au centre de tri',
        location: 'Centre de tri national, Djibouti-Ville',
        occurredAt: isoDaysFromNow(-5, 14),
      },
      {
        id: 'EVT-7',
        status: 'IN_TRANSIT',
        label: 'Acheminement vers Ali Sabieh',
        location: 'Axe RN1',
        occurredAt: isoDaysFromNow(-3, 9),
      },
      {
        id: 'EVT-8',
        status: 'DELIVERED',
        label: 'Colis livré',
        location: 'Ali Sabieh',
        occurredAt: isoDaysFromNow(-1, 11),
        comment: 'Remis contre signature.',
      },
    ],
  },
  {
    trackingNumber: 'LP555000111DJ',
    status: 'EXCEPTION',
    serviceLabel: 'Colis International',
    weightKg: 5.2,
    origin: MOCK_ADDRESSES[3],
    destination: MOCK_ADDRESSES[6],
    estimatedDeliveryDate: isoDaysFromNow(4, 12),
    notificationsEnabled: false,
    events: [
      {
        id: 'EVT-9',
        status: 'CREATED',
        label: 'Envoi enregistré',
        location: "Agence Aéroport, Djibouti-Ville",
        occurredAt: isoDaysFromNow(-4, 8),
      },
      {
        id: 'EVT-10',
        status: 'IN_TRANSIT',
        label: 'En transit',
        location: 'Djibouti-Ville',
        occurredAt: isoDaysFromNow(-2, 15),
      },
      {
        id: 'EVT-11',
        status: 'EXCEPTION',
        label: 'Livraison suspendue - zone hors couverture',
        location: 'Obock',
        occurredAt: isoDaysFromNow(-1, 9),
        comment: 'Contactez le service client pour un retrait en agence.',
      },
    ],
  },
];
