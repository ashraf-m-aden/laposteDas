import type {
  AppNotification,
  AuthSession,
  FaqArticle,
  HistoryItem,
  Shipment,
  Ticket,
  UserAccount,
} from '../models';
import { MOCK_ADDRESSES } from './mock-addresses';
import { isoDaysFromNow } from './mock.util';

/** Comptes de démonstration (mot de passe : demo1234). */
export const MOCK_USERS: UserAccount[] = [
  {
    id: 'USR-001',
    email: 'client@laposte.dj',
    firstName: 'Amina',
    lastName: 'Houssein',
    phone: '+253 77 12 34 56',
    type: 'INDIVIDUAL',
    status: 'ACTIVE',
    preferences: {
      language: 'fr',
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: false,
    },
  },
  {
    id: 'USR-002',
    email: 'pro@marill.dj',
    firstName: 'Youssouf',
    lastName: 'Abdi',
    phone: '+253 21 35 12 00',
    type: 'BUSINESS',
    status: 'ACTIVE',
    companyName: 'Société Marill SARL',
    legalId: 'NIF-2024-889110',
    preferences: {
      language: 'fr',
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
    },
  },
];

export function buildSession(user: UserAccount): AuthSession {
  return {
    token: `mock-jwt-${user.id}-${Date.now()}`,
    refreshToken: `mock-refresh-${user.id}`,
    expiresAt: isoDaysFromNow(1),
    user,
  };
}

export const MOCK_SHIPMENTS: Shipment[] = [
  {
    id: 'SHP-001',
    trackingNumber: 'LP123456789DJ',
    sender: {
      fullName: 'Société Marill SARL',
      phone: '+253 21 35 12 00',
      email: 'pro@marill.dj',
      address: MOCK_ADDRESSES[7],
    },
    recipient: {
      fullName: 'Amina Houssein',
      phone: '+253 77 12 34 56',
      address: MOCK_ADDRESSES[0],
    },
    parcel: { kind: 'PARCEL', weightKg: 2.4, lengthCm: 30, widthCm: 20, heightCm: 15 },
    serviceLabel: 'Express national',
    optionLabels: ['Remise contre signature'],
    price: 2000,
    currency: 'DJF',
    status: 'IN_PROGRESS',
    createdAt: isoDaysFromNow(-3, 9),
    pickupDate: isoDaysFromNow(-3, 14),
  },
  {
    id: 'SHP-002',
    trackingNumber: 'LP987654321DJ',
    sender: {
      fullName: 'Société Marill SARL',
      phone: '+253 21 35 12 00',
      address: MOCK_ADDRESSES[1],
    },
    recipient: {
      fullName: 'Kadar Omar',
      phone: '+253 77 88 44 21',
      address: MOCK_ADDRESSES[4],
    },
    parcel: { kind: 'DOCUMENT', weightKg: 0.8, lengthCm: 25, widthCm: 18, heightCm: 3 },
    serviceLabel: 'Standard national',
    optionLabels: [],
    price: 900,
    currency: 'DJF',
    status: 'DELIVERED',
    createdAt: isoDaysFromNow(-6, 10),
    pickupDate: isoDaysFromNow(-6, 15),
  },
  {
    id: 'SHP-003',
    trackingNumber: 'LP555000111DJ',
    sender: {
      fullName: 'Société Marill SARL',
      phone: '+253 21 35 12 00',
      address: MOCK_ADDRESSES[3],
    },
    recipient: {
      fullName: 'Fatouma Ismael',
      phone: '+253 77 45 90 12',
      address: MOCK_ADDRESSES[6],
    },
    parcel: { kind: 'FRAGILE', weightKg: 5.2, lengthCm: 40, widthCm: 30, heightCm: 25 },
    serviceLabel: 'International',
    optionLabels: ['Assurance internationale'],
    price: 6100,
    currency: 'DJF',
    status: 'PENDING',
    createdAt: isoDaysFromNow(-4, 8),
    pickupDate: isoDaysFromNow(1, 10),
  },
];

export const MOCK_HISTORY: HistoryItem[] = [
  {
    id: 'HIS-001',
    type: 'SHIPMENT',
    reference: 'LP123456789DJ',
    label: 'Colis Express vers Plateau du Serpent',
    amount: 2000,
    currency: 'DJF',
    status: 'En cours',
    date: isoDaysFromNow(-3, 9),
  },
  {
    id: 'HIS-002',
    type: 'POSTAGE',
    reference: 'AFF-2026-0042',
    label: '10 timbres nationaux 50 DJF',
    amount: 500,
    currency: 'DJF',
    status: 'Payé',
    date: isoDaysFromNow(-5, 16),
  },
  {
    id: 'HIS-003',
    type: 'SHIPMENT',
    reference: 'LP987654321DJ',
    label: 'Pli Standard vers Ali Sabieh',
    amount: 900,
    currency: 'DJF',
    status: 'Livré',
    date: isoDaysFromNow(-6, 10),
  },
  {
    id: 'HIS-004',
    type: 'POSTAGE',
    reference: 'AFF-2026-0031',
    label: 'Pack expédition 2 kg',
    amount: 1500,
    currency: 'DJF',
    status: 'Payé',
    date: isoDaysFromNow(-12, 11),
  },
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'NOT-001',
    type: 'TRACKING',
    title: 'Votre colis est en cours de livraison',
    body: "Le colis LP123456789DJ sera livré aujourd'hui à Plateau du Serpent.",
    createdAt: isoDaysFromNow(0, -2),
    read: false,
    link: '/suivi/LP123456789DJ',
  },
  {
    id: 'NOT-002',
    type: 'SYSTEM',
    title: 'Adresse validée',
    body: 'Votre nouvelle adresse du carnet a été validée par le référentiel postal.',
    createdAt: isoDaysFromNow(-1, 9),
    read: false,
  },
  {
    id: 'NOT-003',
    type: 'PROMO',
    title: 'Collection philatélique 2026',
    body: 'La série commémorative sera disponible en agence le mois prochain.',
    createdAt: isoDaysFromNow(-4, 10),
    read: true,
  },
  {
    id: 'NOT-004',
    type: 'TRACKING',
    title: 'Colis livré',
    body: 'Le colis LP987654321DJ a été remis contre signature à Ali Sabieh.',
    createdAt: isoDaysFromNow(-1, 11),
    read: true,
    link: '/suivi/LP987654321DJ',
  },
];

export const MOCK_TICKETS: Ticket[] = [
  {
    id: 'TCK-001',
    reference: 'SC-2026-0188',
    subject: 'Colis bloqué à Obock',
    category: 'Livraison',
    status: 'PENDING',
    createdAt: isoDaysFromNow(-2, 9),
    messages: [
      {
        id: 'MSG-1',
        author: 'CLIENT',
        body: 'Bonjour, mon colis LP555000111DJ est suspendu depuis hier.',
        sentAt: isoDaysFromNow(-2, 9),
      },
      {
        id: 'MSG-2',
        author: 'AGENT',
        body: 'Bonjour, la zone est hors couverture de livraison. Un retrait en agence est possible.',
        sentAt: isoDaysFromNow(-1, 10),
      },
    ],
  },
  {
    id: 'TCK-002',
    reference: 'SC-2026-0155',
    subject: 'Facture affranchissement',
    category: 'Facturation',
    status: 'RESOLVED',
    createdAt: isoDaysFromNow(-9, 14),
    messages: [
      {
        id: 'MSG-3',
        author: 'CLIENT',
        body: 'Je souhaite recevoir la facture de la commande AFF-2026-0031.',
        sentAt: isoDaysFromNow(-9, 14),
      },
      {
        id: 'MSG-4',
        author: 'AGENT',
        body: 'La facture vous a été envoyée par e-mail.',
        sentAt: isoDaysFromNow(-8, 9),
      },
    ],
  },
];

export const MOCK_FAQ: FaqArticle[] = [
  {
    id: 'FAQ-001',
    category: 'Suivi',
    question: 'Où trouver mon numéro de suivi ?',
    answer:
      "Le numéro de suivi figure sur le récépissé remis en agence et dans l'e-mail de confirmation. Il commence par LP et se termine par DJ.",
  },
  {
    id: 'FAQ-002',
    category: 'Suivi',
    question: "Mon colis n'apparaît pas, que faire ?",
    answer:
      'Un colis devient visible sous 2 heures après son enregistrement en agence. Passé ce délai, ouvrez une demande auprès du service client.',
  },
  {
    id: 'FAQ-003',
    category: 'Envoi',
    question: 'Pourquoi mon adresse est-elle refusée ?',
    answer:
      "Toute adresse doit être validée par le référentiel postal avant expédition. Utilisez l'autocomplétion et sélectionnez une suggestion proposée.",
  },
  {
    id: 'FAQ-004',
    category: 'Affranchissement',
    question: 'Comment récupérer mon étiquette ?',
    answer:
      "Après paiement, l'étiquette est générée immédiatement et téléchargeable depuis votre historique pendant 30 jours.",
  },
  {
    id: 'FAQ-005',
    category: 'Compte',
    question: 'Comment ouvrir un compte entreprise ?',
    answer:
      "Depuis l'inscription professionnelle, avec la raison sociale, l'identifiant légal et une adresse validée. L'activation intervient après contrôle manuel.",
  },
];
