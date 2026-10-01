import { FileDown, Pencil, Trash2, Eye } from 'lucide-react';
import { Printer } from 'lucide-react';
import type { Facture } from '../../types/facture';

interface Props {
  factures: Facture[];

  onEdit: (facture: Facture) => void;

  onDelete: (facture: Facture) => void;

  onPreview: (facture: Facture) => void;

  onStatusChange: (id: number, statut: Facture['statut']) => void;

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
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[1450px] table-fixed">
          <colgroup>
            <col className="w-[200px]" />
            <col className="w-[300px]" />
            <col className="w-[160px]" />
            <col className="w-[250px]" />
            <col className="w-[140px]" />
            <col className="w-[400px]" />
          </colgroup>
        <thead className="bg-slate-100">
          <tr>
            <th className="w-[180px] p-4 text-left">Facture</th>

            <th className="w-[260px] text-left">Client</th>

            <th className="w-[150px] text-center">Date</th>

            <th className="w-[170px] text-center">Montant TTC</th>

            <th className="w-[140px] text-center">Statut</th>

            <th className="w-[380px] text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {factures.map((facture) => (
            <tr key={facture.id} className="border-t hover:bg-slate-50">
              <td className="whitespace-nowrap p-4 font-semibold">
                {facture.numero}
              </td>

              <td className="px-4">
                <div className="truncate" title={facture.client}>
                  {facture.client}
                </div>
              </td>

              <td className="whitespace-nowrap px-4 text-center">
                {facture.dateEmission.slice(0, 10).split('-').reverse().join('/')}
              </td>

              <td className="whitespace-nowrap px-4 text-center font-medium">
                {facture.montantTTC.toLocaleString()} FCFA
              </td>

              <td className="whitespace-nowrap">
                <select
                  value={facture.statut}
                  onChange={(e) =>
                    onStatusChange(
                      facture.id,
                      e.target.value as Facture['statut'],
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
