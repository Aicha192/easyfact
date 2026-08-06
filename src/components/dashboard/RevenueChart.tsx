import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useFactureStore } from "../../store/factureStore";

export default function RevenueChart() {
  const factures = useFactureStore((state) => state.factures);

  const data = factures.reduce((acc: any[], facture) => {
    const date = new Date(facture.dateEmission);

    const mois = date.toLocaleDateString("fr-FR", {
      month: "short",
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

      <div className="h-80">
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
                  `${Number(value).toLocaleString("fr-FR")} FCFA`
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
