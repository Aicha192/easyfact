import { useState } from "react";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

import type { Produit } from "../../types/produit";

export interface ProduitFormData {
  reference: string;
  nom: string;
  categorie: "Produit" | "Service";
  prix: number;
  unite: string;
  statut: "Actif" | "Inactif";
}

interface Props {
  initialData?: Produit;

  onSubmit: (produit: ProduitFormData) => void;

  onCancel: () => void;
}

function generateReference() {
  const random = Math.floor(Math.random() * 9000) + 1000;

  return `P-${random}`;
}

export default function ProduitForm({
  initialData,
  onSubmit,
  onCancel,
}: Props) {
  const [form, setForm] = useState<ProduitFormData>(
    initialData ?? {
      reference: generateReference(),
      nom: "",
      categorie: "Produit",
      prix: 0,
      unite: "Pièce",
      statut: "Actif",
    },
  );

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,

      [name]: name === "prix" ? Number(value) : value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Référence"
        name="reference"
        value={form.reference}
        readOnly
      />

      <Input
        label="Nom du produit / service"
        name="nom"
        value={form.nom}
        onChange={handleChange}
        placeholder="Ex: Développement Web"
        required
      />

      <Select
        label="Catégorie"
        name="categorie"
        value={form.categorie}
        onChange={handleChange}
      >
        <option value="Produit">Produit</option>

        <option value="Service">Service</option>
      </Select>

      <Input
        label="Prix"
        name="prix"
        type="number"
        value={form.prix}
        onChange={handleChange}
        required
      />

      <Input
        label="Unité"
        name="unite"
        value={form.unite}
        onChange={handleChange}
        placeholder="Pièce, Heure, Projet..."
      />

      <Select
        label="Statut"
        name="statut"
        value={form.statut}
        onChange={handleChange}
      >
        <option value="Actif">Actif</option>

        <option value="Inactif">Inactif</option>
      </Select>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border px-5 py-2 hover:bg-slate-100"
        >
          Annuler
        </button>

        <Button type="submit">{initialData ? "Enregistrer" : "Ajouter"}</Button>
      </div>
    </form>
  );
}
