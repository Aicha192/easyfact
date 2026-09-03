import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import type { Facture } from '../../types/facture';

export default function RecentInvoices() {
  const [facturesBackend, setFacturesBackend] = useState<Facture[]>([]);
  useEffect(() => {
    api
      .get<Facture[]>('/factures')
      .then((response) => {
        console.log(
          'Dernières factures récupérées depuis NestJS:',
          response.data,
        );
        setFacturesBackend(response.data);
      })
      .catch((error) => {
        console.error(
          'Erreur lors de la récupération des dernières factures:',
          error,
        );
      });
  }, []);

  const factures = facturesBackend;

  const invoices = factures.slice(-5).reverse();

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">Dernières factures</h2>

      <div className="w-full min-w-0 overflow-x-auto">
        <table className="w-full min-w-[650px]">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="whitespace-nowrap pb-3">N°</th>
              <th className="whitespace-nowrap pb-3">Client</th>
              <th className="whitespace-nowrap pb-3">Montant</th>
              <th className="whitespace-nowrap pb-3">Statut</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.numero} className="border-b">
                <td className="whitespace-nowrap py-4">{invoice.id}</td>

                <td className="whitespace-nowrap">{invoice.client}</td>

                <td className="whitespace-nowrap">
                  {invoice.montantTTC.toLocaleString('fr-FR')} FCFA
                </td>

                <td className="whitespace-nowrap">
                  <span
                    className={`
    rounded-full px-3 py-1 text-sm
    ${
      invoice.statut === 'Payée'
        ? 'bg-emerald-100 text-emerald-700'
        : invoice.statut === 'En retard'
          ? 'bg-red-100 text-red-700'
          : 'bg-yellow-100 text-yellow-700'
    }
  `}
                  >
                    {invoice.statut}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
