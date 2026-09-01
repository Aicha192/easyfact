import type { Proforma } from '../types/proforma';

export const proformas: Proforma[] = [
  {
    id: 1,

    numero: 'PRO-2026-001',

    client: 'Alpha SARL',

    items: [
      {
        id: 1,
        designation: 'Création site web',
        quantite: 1,
        prixUnitaire: 300000,
        total: 300000,
      },
    ],

    dateEmission: '20/07/2026',

    dateValidite: '20/08/2026',

    montantHT: 300000,

    tva: 18,

    montantTTC: 354000,

    statut: 'Envoyée',
  },

  {
    id: 2,

    numero: 'PRO-2026-002',

    client: 'Beta Services',

    items: [
      {
        id: 1,
        designation: 'Maintenance annuelle',
        quantite: 1,
        prixUnitaire: 150000,
        total: 150000,
      },
    ],

    dateEmission: '22/07/2026',

    dateValidite: '22/08/2026',

    montantHT: 150000,

    tva: 18,

    montantTTC: 177000,

    statut: 'Brouillon',
  },
];
