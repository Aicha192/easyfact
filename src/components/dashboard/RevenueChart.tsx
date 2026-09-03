import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import type { Facture } from '../../types/facture';

export default function RevenueChart() {
  const [facturesBackend, setFacturesBackend] = useState<Facture[]>([]);
  useEffect(() => {
    api
     .get<Facture[]>('/factures')
      .then((response) => {
        console.log('Factures du graphique depuis NestJS:', response.data);
        setFacturesBackend(response.data);
      })
      .catch((error) => {
        console.error(
          'Erreur lors de la récupération des factures du graphique:',
          error,
        );
      });
  }, []);

 const factures = facturesBackend.filter(
  (facture) => facture.statut === 'Payée',
);

  const data = factures.reduce((acc: any[], facture) => {
    const date = new Date(facture.dateEmission);

    const mois = date.toLocaleDateString('fr-FR', {
      month: 'short',
    });

    const existing = acc.find((item) => item.mois === mois);

    if (existing) {
      existing.revenus += facture.montantTTC;
    } else {
      acc.push({
        mois,
        revenus: facture.montantTTC,
      });
    }

    return acc;
  }, []);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Revenus mensuels</h2>

          <p className="text-sm text-gray-500">
            Évolution du chiffre d'affaires
          </p>
        </div>
      </div>

      <div className="h-64 min-w-0 sm:h-72 lg:h-80">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-slate-500">
            Aucune facture payée disponible
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="mois" />

              <YAxis />

              <Tooltip
                formatter={(value) =>
                  `${Number(value).toLocaleString('fr-FR')} FCFA`
                }
              />

              <Line
                type="monotone"
                dataKey="revenus"
                stroke="#059669"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
