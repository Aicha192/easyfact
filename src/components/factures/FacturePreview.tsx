import type { Facture } from '../../types/facture';
import type { FactureItem } from '../../types/factureItem';
import { useParametresStore } from '../../store/parametresStore';
import { useEffect, useState } from 'react';
import type { Client } from '../../types/client';
import api from '../../lib/axios';
import { Printer } from 'lucide-react';

interface Props {
  facture: Facture;
  items: FactureItem[];
}

export default function FacturePreview({ facture, items }: Props) {
    const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    api
      .get<Client[]>('/clients')
      .then((response) => {
        setClients(response.data);
      })
      .catch((error) => {
        console.error(
          'Erreur lors de la récupération des clients :',
          error,
        );
      });
  }, []);
  
  function handlePrint() {
    window.print();
  }

  const entreprise = useParametresStore((state) => state.parametres);

  const client = clients.find((c) => c.nom === facture.client);

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

      {/* ENTREPRISE */}

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
            {entreprise.nomEntreprise || 'EasyFact'}
          </h2>

          <p className="text-sm text-slate-500">{entreprise.adresse}</p>

          <p className="text-sm text-slate-500">{entreprise.telephone}</p>

          <p className="text-sm text-slate-500">{entreprise.email}</p>
        </div>
      </div>

      {/* INFOS FACTURE */}

      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold">FACTURE</h2>

          <p>N° {facture.numero}</p>

          <p className="mt-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-700">
              {facture.statut}
            </span>
          </p>
        </div>

        <div className="text-right text-sm">
          <p>Date émission : {facture.dateEmission}</p>

          <p>Date échéance : {facture.dateEcheance}</p>
        </div>
      </div>

      {/* CLIENT */}

      <div className="rounded-xl border bg-slate-50 p-4">
        <h3 className="mb-3 font-semibold">CLIENT</h3>

        <p className="font-medium">{facture.client}</p>

        {client && (
          <div className="mt-2 space-y-1 text-sm text-slate-600">
            <p>Email : {client.email}</p>

            <p>Téléphone : {client.telephone}</p>

            <p>Adresse : {client.adresse}</p>
          </div>
        )}
      </div>

      {/* PRODUITS */}

      <table className="w-full border rounded-xl overflow-hidden">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-3 text-left">Désignation</th>

            <th>Qté</th>

            <th>Prix unitaire</th>

            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-3">{item.designation}</td>

              <td className="text-center">{item.quantite}</td>

              <td className="text-center">
                {item.prixUnitaire.toLocaleString('fr-FR')} FCFA
              </td>

              <td className="text-center font-medium">
                {item.total.toLocaleString('fr-FR')} FCFA
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TOTAUX */}

      <div className="flex justify-end">
        <div className="w-72 rounded-xl border bg-slate-50 p-4 space-y-3">
          <div className="flex justify-between">
            <span>Sous-total HT</span>

            <strong>{facture.montantHT.toLocaleString('fr-FR')} FCFA</strong>
          </div>

          <div className="flex justify-between">
            <span>TVA ({facture.tva}%)</span>

            <strong>
              {((facture.montantHT * facture.tva) / 100).toLocaleString(
                'fr-FR',
              )}{' '}
              FCFA
            </strong>
          </div>

          <div className="border-t pt-3 flex justify-between text-lg font-bold text-emerald-600">
            <span>Total TTC</span>

            <span>{facture.montantTTC.toLocaleString('fr-FR')} FCFA</span>
          </div>
        </div>
      </div>

      {/* NOTES */}

      {facture.notes && (
        <div>
          <h3 className="font-semibold">Notes</h3>

          <p className="text-sm text-slate-600">{facture.notes}</p>
        </div>
      )}

      {/* CONDITIONS */}

      {entreprise.conditionsPaiement && (
        <div>
          <h3 className="font-semibold">Conditions de paiement</h3>

          <p className="text-sm text-slate-600">
            {entreprise.conditionsPaiement}
          </p>
        </div>
      )}

      {/* SIGNATURE */}

      <div className="flex justify-end pt-8">
        <div className="text-center">
          <p className="font-medium">Signature et cachet</p>

          <div className="mt-8 w-40 border-t"></div>

          {entreprise.responsable && (
            <p className="mt-2 text-sm">{entreprise.responsable}</p>
          )}
        </div>
      </div>
    </div>
  );
}
