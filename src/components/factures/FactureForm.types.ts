import type { StatutFacture } from "../../types/facture";

export interface FactureFormData {
  id?: number;

  client: string;

  numero: string;

  dateEmission: string;

  dateEcheance: string;

  montantHT: number;

  tva: number;

  statut: StatutFacture;

  notes: string;
}