import { beforeEach, describe, expect, it } from "vitest";
import { useFactureStore } from "../store/factureStore";
import type { Facture } from "../types/facture";

const factureTest: Facture = {
  id: 9999,
  numero: "FAC-TEST-9999",
  client: "Client Test",
  items: [],
  dateEmission: "2026-08-09",
  dateEcheance: "2026-09-08",
  montantHT: 100000,
  tva: 18,
  montantTTC: 118000,
  statut: "Brouillon",
  notes: "Facture de test",
};

describe("factureStore", () => {
  beforeEach(() => {
    useFactureStore.setState({
      factures: [],
    });
  });

  it("ajoute une facture", () => {
    useFactureStore.getState().addFacture(factureTest);

    const factures = useFactureStore.getState().factures;

    expect(factures).toHaveLength(1);
    expect(factures[0]).toEqual(factureTest);
  });

  it("modifie une facture", () => {
    useFactureStore.setState({
      factures: [factureTest],
    });

    const factureModifiee = {
      ...factureTest,
      client: "Nouveau Client",
      montantHT: 150000,
      montantTTC: 177000,
    };

    useFactureStore.getState().updateFacture(factureModifiee);

    const facture = useFactureStore.getState().factures[0];

    expect(facture.client).toBe("Nouveau Client");
    expect(facture.montantHT).toBe(150000);
    expect(facture.montantTTC).toBe(177000);
  });

  it("supprime une facture", () => {
    useFactureStore.setState({
      factures: [factureTest],
    });

    useFactureStore.getState().deleteFacture(factureTest.id);

    expect(useFactureStore.getState().factures).toHaveLength(0);
  });

  it("modifie le statut d'une facture", () => {
    useFactureStore.setState({
      factures: [factureTest],
    });

    useFactureStore
      .getState()
      .updateStatus(factureTest.id, "Payée");

    const facture = useFactureStore.getState().factures[0];

    expect(facture.statut).toBe("Payée");
  });
});