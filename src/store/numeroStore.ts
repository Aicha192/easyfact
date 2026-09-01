import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NumeroStore {
  factureCount: number;
  proformaCount: number;

  getNextFacture: () => number;
  getNextProforma: () => number;

  incrementFacture: () => void;
  incrementProforma: () => void;
}

export const useNumeroStore = create<NumeroStore>()(
  persist(
    (set, get) => ({
      factureCount: 0,
      proformaCount: 0,

      getNextFacture: () => get().factureCount + 1,

      getNextProforma: () => get().proformaCount + 1,

      incrementFacture: () =>
        set((state) => ({
          factureCount: state.factureCount + 1,
        })),

      incrementProforma: () =>
        set((state) => ({
          proformaCount: state.proformaCount + 1,
        })),
    }),
    {
      name: 'easyfact-numeros',
    },
  ),
);
