import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { ParametresEntreprise } from '../types/parametres';

interface ParametresStore {
  parametres: ParametresEntreprise;

  updateParametres: (parametres: ParametresEntreprise) => void;
}

export const useParametresStore = create<ParametresStore>()(
  persist(
    (set) => ({
      parametres: {
        nomEntreprise: 'EasyFact',

        responsable: '',

        adresse: '',

        telephone: '',

        email: '',

        siteWeb: '',

        ninea: '',

        rccm: '',

        devise: 'FCFA',

        conditionsPaiement: 'Paiement à réception',

        logo: '',
      },

      updateParametres: (parametres) => set({ parametres }),
    }),

    {
      name: 'easyfact-parametres',
    },
  ),
);
