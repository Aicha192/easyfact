export interface Produit {
  id: number;

  reference: string;

  nom: string;

  categorie: 'Produit' | 'Service';

  prix: number;

  unite: string;

  statut: 'Actif' | 'Inactif';
}
