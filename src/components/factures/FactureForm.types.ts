import type { StatutFacture } from '../../types/facture';
import type { FactureItem } from '../../types/factureItem';

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

  items: FactureItem[];
}
