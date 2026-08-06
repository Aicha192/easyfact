import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Proforma } from "../types/proforma";
import { proformas as initialProformas } from "../data/proformas";


interface ProformaStore {

  proformas: Proforma[];

  addProforma: (proforma: Proforma) => void;

  updateProforma: (proforma: Proforma) => void;

  deleteProforma: (id: number) => void;

  updateStatus: (
    id: number,
    statut: Proforma["statut"]
  ) => void;
}


export const useProformaStore = create<ProformaStore>()(
  persist(
    (set) => ({

     proformas: initialProformas,


      addProforma: (proforma) =>
        set((state) => ({
          proformas: [
            ...state.proformas,
            proforma,
          ],
        })),


      updateProforma: (proforma) =>
        set((state) => ({
          proformas: state.proformas.map((p) =>
            p.id === proforma.id
              ? proforma
              : p
          ),
        })),


      deleteProforma: (id) =>
        set((state) => ({
          proformas: state.proformas.filter(
            (p) => p.id !== id
          ),
        })),


      updateStatus: (id, statut) =>
        set((state) => ({
          proformas: state.proformas.map((p) =>
            p.id === id
              ? {
                  ...p,
                  statut,
                }
              : p
          ),
        })),

    }),

    {
      name: "proformas-storage",
    }

  )
);