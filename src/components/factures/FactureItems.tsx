import { Plus, Trash2 } from 'lucide-react';

import type { FactureItem } from '../../types/factureItem';
import { useProduitStore } from '../../store/produitStore';

interface Props {
  items: FactureItem[];

  onAdd: () => void;

  onDelete: (id: number) => void;

  onChange: (
    id: number,
    field: keyof FactureItem,
    value: string | number,
  ) => void;
}

export default function FactureItems({
  items,
  onAdd,
  onDelete,
  onChange,
}: Props) {
  const produits = useProduitStore((state) => state.produits);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Produits / Services</h3>

        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
        >
          <Plus size={18} />
          Ajouter une ligne
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Désignation</th>
              <th>Qté</th>
              <th>PU</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-3">
                  <select
                    value={item.designation}
                    onChange={(e) =>
                      onChange(item.id, 'designation', e.target.value)
                    }
                    className="w-full rounded-lg border p-2"
                  >
                    <option value="">Sélectionner un produit</option>

                    {produits.map((produit) => (
                      <option key={produit.id} value={produit.nom}>
                        {produit.nom}
                      </option>
                    ))}
                  </select>
                </td>

                <td>
                  <input
                    type="number"
                    min={1}
                    value={item.quantite}
                    onChange={(e) =>
                      onChange(item.id, 'quantite', Number(e.target.value))
                    }
                    className="w-20 rounded-lg border p-2"
                  />
                </td>

                <td>
                  <input
                    type="number"
                    min={0}
                    value={item.prixUnitaire}
                    onChange={(e) =>
                      onChange(item.id, 'prixUnitaire', Number(e.target.value))
                    }
                    className="w-32 rounded-lg border p-2"
                  />
                </td>

                <td className="font-semibold">
                  {item.total.toLocaleString()} FCFA
                </td>

                <td>
                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
