import type { Proforma } from "../../types/proforma";
import { useParametresStore } from "../../store/parametresStore";
import { clients } from "../../data/clients";
import { Printer } from "lucide-react";

interface Props {
  proforma: Proforma;
}

export default function ProformaPreview({ proforma }: Props) {
  const entreprise = useParametresStore((state) => state.parametres);

  const client = clients.find((c) => c.nom === proforma.client);

  function handlePrint() {
    window.print();
  }
  return (
    <div className="print-area space-y-6">
      <div className="flex justify-end">
        <button
          onClick={handlePrint}
          className="
      flex
      items-center
      gap-2
      rounded-xl
      bg-emerald-600
      px-4
      py-2
      text-white
      hover:bg-emerald-700
    "
        >
          <Printer size={18} />
          Imprimer
        </button>
      </div>

      <div className="flex items-center gap-4 border-b pb-4">
        {entreprise.logo && (
          <img
            src={entreprise.logo}
            alt="Logo"
            className="h-16 w-16 rounded-lg border object-contain"
          />
        )}

        <div>
          <h2 className="text-2xl font-bold text-emerald-600">
            {entreprise.nomEntreprise || "EasyFact"}
          </h2>

          <p className="text-sm text-slate-500">{entreprise.adresse}</p>

          <p className="text-sm text-slate-500">{entreprise.telephone}</p>

          <p className="text-sm text-slate-500">{entreprise.email}</p>
        </div>
      </div>

      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold">PROFORMA</h2>

          <p>N° {proforma.numero}</p>

          <p className="mt-2">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
              {proforma.statut}
            </span>
          </p>
        </div>

        <div className="text-right text-sm">
          <p>Date émission : {proforma.dateEmission}</p>

          <p>Date de validité : {proforma.dateValidite}</p>
        </div>
      </div>

      <div className="rounded-xl border bg-slate-50 p-4">
        <h3 className="mb-3 font-semibold">CLIENT</h3>

        <p className="font-medium">{proforma.client}</p>

        {client && (
          <div className="mt-2 space-y-1 text-sm text-slate-600">
            <p>Email : {client.email}</p>

            <p>Téléphone : {client.telephone}</p>

            <p>Adresse : {client.adresse}</p>
          </div>
        )}
      </div>

      <table className="w-full border rounded-lg overflow-hidden">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-3 text-left">Désignation</th>

            <th>Qté</th>

            <th>PU</th>

            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {proforma.items.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-3">{item.designation}</td>

              <td>{item.quantite}</td>

              <td>{item.prixUnitaire.toLocaleString()} FCFA</td>

              <td>{item.total.toLocaleString()} FCFA</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TOTAUX */}

      <div className="flex justify-end">
        <div className="w-80 rounded-xl border bg-slate-50 p-5 space-y-3">
          <div className="flex justify-between">
            <span className="font-medium">Montant HT</span>

            <strong>{proforma.montantHT.toLocaleString("fr-FR")} FCFA</strong>
          </div>

           <div className="flex justify-between">
            <span>TVA ({proforma.tva}%)</span>

            <strong>
              {((proforma.montantHT * proforma.tva) / 100).toLocaleString(
                "fr-FR",
              )}{" "}
              FCFA
            </strong>
          </div>

          <div className="flex justify-between border-t pt-3 text-xl font-bold text-emerald-600">
            <span>Total TTC</span>

            <span>{proforma.montantTTC.toLocaleString("fr-FR")} FCFA</span>
          </div>
        </div>
      </div>

      {proforma.notes && (
        <div>
          <h3 className="font-semibold">Notes</h3>

          <p className="text-slate-600">{proforma.notes}</p>
        </div>
      )}
    </div>
  );
}
