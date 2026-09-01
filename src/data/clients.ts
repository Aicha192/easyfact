import type { Client } from '../types/client';

export const clients: Client[] = [
  {
    id: 1,
    nom: 'Alpha SARL',
    email: 'contact@alpha.sn',
    telephone: '77 123 45 67',
    adresse: 'Dakar',
    statut: 'Actif',
  },
  {
    id: 2,
    nom: 'Beta Services',
    email: 'contact@beta.sn',
    telephone: '76 222 33 44',
    adresse: 'Thiès',
    statut: 'Actif',
  },
  {
    id: 3,
    nom: 'Gamma Tech',
    email: 'contact@gamma.sn',
    telephone: '78 555 66 77',
    adresse: 'Saint-Louis',
    statut: 'Inactif',
  },
];
