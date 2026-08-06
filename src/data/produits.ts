import type { Produit } from "../types/produit";

export const produits: Produit[] = [
  {
    id: 1,
    reference: "P001",
    nom: "Développement site web",
    categorie: "Service",
    prix: 450000,
    unite: "Projet",
    statut: "Actif",
  },
  {
    id: 2,
    reference: "P002",
    nom: "Hébergement annuel",
    categorie: "Service",
    prix: 60000,
    unite: "An",
    statut: "Actif",
  },
  {
    id: 3,
    reference: "P003",
    nom: "Ordinateur portable",
    categorie: "Produit",
    prix: 350000,
    unite: "Pièce",
    statut: "Actif",
  },
];