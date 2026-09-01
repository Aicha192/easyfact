import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Produit } from '../types/produit';

interface ProduitStore {
  produits: Produit[];

  setProduits: (produits: Produit[]) => void;

  addProduit: (produit: Produit) => void;

  updateProduit: (produit: Produit) => void;

  deleteProduit: (id: number) => void;
}

export const useProduitStore = create<ProduitStore>()(
  persist(
    (set) => ({
      produits: [],
      setProduits: (produits) =>
  set({
    produits,
  }),

      addProduit: (produit) =>
        set((state) => ({
          produits: [...state.produits, produit],
        })),

      updateProduit: (produit) =>
        set((state) => ({
          produits: state.produits.map((p) =>
            p.id === produit.id ? produit : p,
          ),
        })),

      deleteProduit: (id) =>
        set((state) => ({
          produits: state.produits.filter((p) => p.id !== id),
        })),
    }),
    {
      name: 'produits-storage',
    },
  ),
);
