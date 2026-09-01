import type { FactureItem } from './factureItem';

export type StatutFacture = 'Brouillon' | 'Envoyée' | 'Payée' | 'En retard';

export interface Facture {
  id: number;

  numero: string;

  client: string;

  items: FactureItem[];

  dateEmission: string;

  dateEcheance: string;

  montantHT: number;

  tva: number;

  montantTTC: number;

  statut: StatutFacture;

  notes?: string;
}
