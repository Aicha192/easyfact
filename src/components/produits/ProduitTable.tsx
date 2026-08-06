import { Pencil, Trash2 } from "lucide-react";

import type { Produit } from "../../types/produit";
import Badge from "../ui/Badge";

interface Props {
  produits: Produit[];
  onEdit: (produit: Produit) => void;
  onDelete: (produit: Produit) => void;
}

export default function ProduitTable({ produits, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <table className="w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-4 text-left">Référence</th>

            <th>Nom</th>

            <th>Catégorie</th>

            <th>Prix</th>

            <th>Unité</th>

            <th>Statut</th>

            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {produits.map((produit) => (
            <tr key={produit.id} className="border-t hover:bg-slate-50">
              <td className="p-4 font-medium">{produit.reference}</td>

              <td>{produit.nom}</td>

              <td>{produit.categorie}</td>

              <td className="font-semibold text-emerald-700">
                {produit.prix.toLocaleString()} FCFA
              </td>

              <td>{produit.unite}</td>

              <td>
                <Badge color={produit.statut === "Actif" ? "green" : "red"}>
                  {produit.statut}
                </Badge>
              </td>

              <td>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(produit)}
                    className="rounded-lg bg-blue-100 p-2 text-blue-600 transition hover:scale-105 hover:bg-blue-200"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => onDelete(produit)}
                    className="rounded-lg bg-red-100 p-2 text-red-600 transition hover:scale-105 hover:bg-red-200"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
