import type { Facture } from "../types/facture";

export const factures: Facture[] = [
  {
    id: 1,
    numero: "FAC-2026-001",
    client: "Alpha SARL",

    items: [
      {
        id: 1,
        designation: "Développement site web",
        quantite: 1,
        prixUnitaire: 100000,
        total: 100000,
      },
    ],

    dateEmission: "12/07/2026",
    dateEcheance: "12/08/2026",

    montantHT: 100000,
    tva: 18,
    montantTTC: 118000,

    statut: "Payée",
  },


  {
    id: 2,
    numero: "FAC-2026-002",
    client: "Beta Services",

    items: [
      {
        id: 1,
        designation: "Maintenance logiciel",
        quantite: 5,
        prixUnitaire: 50000,
        total: 250000,
      },
    ],

    dateEmission: "15/07/2026",
    dateEcheance: "15/08/2026",

    montantHT: 250000,
    tva: 18,
    montantTTC: 295000,

    statut: "Envoyée",
  },


  {
    id: 3,
    numero: "FAC-2026-003",
    client: "Gamma Technologie",

    items: [
      {
        id: 1,
        designation: "Solution informatique",
        quantite: 1,
        prixUnitaire: 500000,
        total: 500000,
      },
    ],

    dateEmission: "01/06/2026",
    dateEcheance: "01/07/2026",

    montantHT: 500000,
    tva: 18,
    montantTTC: 590000,

    statut: "En retard",
  },


  {
    id: 4,
    numero: "FAC-2026-004",
    client: "Delta Consulting",

    items: [
      {
        id: 1,
        designation: "Audit informatique",
        quantite: 1,
        prixUnitaire: 75000,
        total: 75000,
      },
    ],

    dateEmission: "18/07/2026",
    dateEcheance: "18/08/2026",

    montantHT: 75000,
    tva: 18,
    montantTTC: 88500,

    statut: "Brouillon",
  },
];