import type { BusinessRate, PostageProduct, ServiceOffer } from '../models';

/** Catalogue d'affranchissement (6.8). */
export const MOCK_POSTAGE_PRODUCTS: PostageProduct[] = [
  {
    id: 'PRD-001',
    name: 'Timbre national 50 DJF',
    category: 'STAMP',
    description: 'Lettre standard jusqu\'à 20 g, distribution nationale.',
    unitPrice: 50,
    currency: 'DJF',
    available: true,
    icon: 'stamp',
  },
  {
    id: 'PRD-002',
    name: 'Timbre international 250 DJF',
    category: 'STAMP',
    description: 'Lettre standard jusqu\'à 20 g, destination internationale.',
    unitPrice: 250,
    currency: 'DJF',
    available: true,
    icon: 'globe',
  },
  {
    id: 'PRD-003',
    name: 'Enveloppe prêt-à-poster A5',
    category: 'ENVELOPE',
    description: 'Enveloppe pré-affranchie, jusqu\'à 100 g.',
    unitPrice: 350,
    currency: 'DJF',
    available: true,
    icon: 'envelope',
  },
  {
    id: 'PRD-004',
    name: 'Pack expédition 2 kg',
    category: 'PACK',
    description: 'Emballage et affranchissement inclus jusqu\'à 2 kg.',
    unitPrice: 1500,
    currency: 'DJF',
    available: true,
    icon: 'box',
  },
  {
    id: 'PRD-005',
    name: 'Collection philatélique 2026',
    category: 'COLLECTION',
    description: 'Série commémorative, tirage limité.',
    unitPrice: 4500,
    currency: 'DJF',
    available: false,
    icon: 'collection',
  },
  {
    id: 'PRD-006',
    name: 'Pack expédition 5 kg',
    category: 'PACK',
    description: 'Emballage renforcé et affranchissement jusqu\'à 5 kg.',
    unitPrice: 2900,
    currency: 'DJF',
    available: true,
    icon: 'box',
  },
];

/** Prestations d'envoi proposées par le back-end après tarification (6.5). */
export const MOCK_SERVICE_OFFERS: ServiceOffer[] = [
  {
    code: 'STD',
    label: 'Standard national',
    description: 'Livraison en agence ou à domicile, suivi inclus.',
    deliveryDelayLabel: '3 à 5 jours ouvrés',
    price: 900,
    currency: 'DJF',
    available: true,
    options: [
      { code: 'INS', label: 'Assurance jusqu\'à 50 000 DJF', price: 300 },
      { code: 'SIG', label: 'Remise contre signature', price: 200 },
    ],
  },
  {
    code: 'EXP',
    label: 'Express national',
    description: 'Prise en charge prioritaire et livraison rapide.',
    deliveryDelayLabel: '24 à 48 heures',
    price: 1800,
    currency: 'DJF',
    available: true,
    options: [
      { code: 'INS', label: 'Assurance jusqu\'à 50 000 DJF', price: 300 },
      { code: 'SIG', label: 'Remise contre signature', price: 200 },
      { code: 'SMS', label: 'Alerte SMS destinataire', price: 100 },
    ],
  },
  {
    code: 'INT',
    label: 'International',
    description: 'Acheminement hors Djibouti via partenaires postaux.',
    deliveryDelayLabel: '7 à 15 jours',
    price: 5200,
    currency: 'DJF',
    available: false,
    unavailableReason: 'Non éligible pour une destination nationale.',
    options: [{ code: 'INS', label: 'Assurance internationale', price: 900 }],
  },
];

/** Grille tarifaire négociée factice (compte entreprise). */
export const MOCK_BUSINESS_RATES: BusinessRate[] = [
  { serviceCode: 'STD', serviceLabel: 'Standard national', zone: 'Djibouti-Ville', weightUpToKg: 1, publicPrice: 900, negotiatedPrice: 720, currency: 'DJF' },
  { serviceCode: 'STD', serviceLabel: 'Standard national', zone: 'Djibouti-Ville', weightUpToKg: 5, publicPrice: 1800, negotiatedPrice: 1440, currency: 'DJF' },
  { serviceCode: 'STD', serviceLabel: 'Standard national', zone: 'Régions', weightUpToKg: 1, publicPrice: 1200, negotiatedPrice: 990, currency: 'DJF' },
  { serviceCode: 'STD', serviceLabel: 'Standard national', zone: 'Régions', weightUpToKg: 5, publicPrice: 2400, negotiatedPrice: 1980, currency: 'DJF' },
  { serviceCode: 'EXP', serviceLabel: 'Express national', zone: 'Djibouti-Ville', weightUpToKg: 1, publicPrice: 1800, negotiatedPrice: 1450, currency: 'DJF' },
  { serviceCode: 'EXP', serviceLabel: 'Express national', zone: 'Djibouti-Ville', weightUpToKg: 5, publicPrice: 3200, negotiatedPrice: 2560, currency: 'DJF' },
  { serviceCode: 'EXP', serviceLabel: 'Express national', zone: 'Régions', weightUpToKg: 5, publicPrice: 4100, negotiatedPrice: 3280, currency: 'DJF' },
  { serviceCode: 'INT', serviceLabel: 'International', zone: 'Zone 1', weightUpToKg: 2, publicPrice: 5200, negotiatedPrice: 4420, currency: 'DJF' },
  { serviceCode: 'INT', serviceLabel: 'International', zone: 'Zone 2', weightUpToKg: 2, publicPrice: 7400, negotiatedPrice: 6290, currency: 'DJF' },
];
