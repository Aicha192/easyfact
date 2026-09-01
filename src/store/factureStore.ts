import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Facture } from '../types/facture';

interface FactureStore {
  factures: Facture[];

   setFactures: (factures: Facture[]) => void;

  addFacture: (facture: Facture) => void;

  updateFacture: (facture: Facture) => void;

  deleteFacture: (id: number) => void;

  updateStatus: (id: number, statut: Facture['statut']) => void;
}

export const useFactureStore = create<FactureStore>()(
  persist(
    (set) => ({
      factures: [],
      setFactures: (factures) =>
  set({
    factures,
  }),

      addFacture: (facture) =>
        set((state) => ({
          factures: [...state.factures, facture],
        })),

      updateFacture: (facture) =>
        set((state) => ({
          factures: state.factures.map((f) =>
            f.id === facture.id ? facture : f,
          ),
        })),

      deleteFacture: (id) =>
        set((state) => ({
          factures: state.factures.filter((f) => f.id !== id),
        })),

      updateStatus: (id, statut) =>
        set((state) => ({
          factures: state.factures.map((f) =>
            f.id === id
              ? {
                  ...f,
                  statut,
                }
              : f,
          ),
        })),
    }),
    {
      name: 'factures-storage',
    },
  ),
);
