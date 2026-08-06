import { FileDown, Pencil, Trash2, Eye } from "lucide-react";
import { Printer } from "lucide-react";
import type { Facture } from "../../types/facture";
import Badge from "../ui/Badge";

interface Props {
  factures: Facture[];

  onEdit: (facture: Facture) => void;

  onDelete: (facture: Facture) => void;

  onPreview: (facture: Facture) => void;

  onStatusChange: (id: number, statut: Facture["statut"]) => void;

  onPdf: (facture: Facture) => void;

  onPrint: (facture: Facture) => void;
}

export default function FactureTable({
  factures,
  onEdit,
  onDelete,
  onPreview,
  onStatusChange,
  onPdf,
  onPrint,
}: Props) {
  function getStatusColor(statut: Facture["statut"]) {
    switch (statut) {
      case "Payée":
        return "green";

      case "Envoyée":
        return "blue";

      case "En retard":
        return "red";

      case "Brouillon":
        return "gray";

      default:
        return "gray";
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <table className="w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-4 text-left">Facture</th>

            <th>Client</th>

            <th>Date</th>

            <th>Montant TTC</th>

            <th>Statut</th>

            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {factures.map((facture) => (
            <tr key={facture.id} className="border-t hover:bg-slate-50">
              <td className="p-4 font-semibold">{facture.numero}</td>

              <td>{facture.client}</td>

              <td>{facture.dateEmission}</td>

              <td className="font-medium">
                {facture.montantTTC.toLocaleString()} FCFA
              </td>

              <td>
                <select
                  value={facture.statut}
                  onChange={(e) =>
                    onStatusChange(
                      facture.id,
                      e.target.value as Facture["statut"],
                    )
                  }
                  className="rounded-lg border border-slate-300 px-2 py-1 text-sm focus:border-emerald-600 focus:outline-none"
                >
                  <option value="Brouillon">Brouillon</option>
                  <option value="Envoyée">Envoyée</option>
                  <option value="Payée">Payée</option>
                  <option value="En retard">En retard</option>
                </select>
              </td>

              <td>
                <div className="flex gap-2">
                  <button
                    onClick={() => onPreview(facture)}
                    className="rounded-lg bg-slate-100 p-2 text-slate-600 transition hover:scale-105 hover:bg-slate-200"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => onEdit(facture)}
                    className="rounded-lg bg-blue-100 p-2 text-blue-600 transition hover:scale-105 hover:bg-blue-200"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => onPdf(facture)}
                    className="rounded-lg bg-emerald-100 p-2 text-emerald-600 transition hover:scale-105 hover:bg-emerald-200"
                  >
                    <FileDown size={18} />
                  </button>

                  <button
                    onClick={() => onPrint(facture)}
                    className="rounded-lg bg-indigo-100 p-2 text-indigo-600 transition hover:scale-105 hover:bg-indigo-200"
                    title="Imprimer"
                  >
                    <Printer size={18} />
                  </button>

                  <button
                    onClick={() => onDelete(facture)}
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
