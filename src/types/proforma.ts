import type { FactureItem } from "./factureItem";


export type StatutProforma =
  | "Brouillon"
  | "Envoyée"
  | "Acceptée"
  | "Refusée"
  | "Expirée";


export interface Proforma {

  id: number;

  numero: string;

  client: string;

  items: FactureItem[];

  dateEmission: string;

  dateValidite: string;

  montantHT: number;

  tva: number;

  montantTTC: number;

  statut: StatutProforma;

  notes?: string;
}