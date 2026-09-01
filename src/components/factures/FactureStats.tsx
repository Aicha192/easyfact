import Card from '../ui/Card';

import type { Facture } from '../../types/facture';

interface Props {
  factures: Facture[];
}

export default function FactureStats({ factures }: Props) {
  const total = factures.length;

  const payees = factures.filter(
    (facture) => facture.statut === 'Payée',
  ).length;

  const envoyees = factures.filter(
    (facture) => facture.statut === 'Envoyée',
  ).length;

  const retard = factures.filter(
    (facture) => facture.statut === 'En retard',
  ).length;

  const stats = [
    {
      title: 'Total',
      value: total,
    },

    {
      title: 'Payées',
      value: payees,
    },

    {
      title: 'Envoyées',
      value: envoyees,
    },

    {
      title: 'En retard',
      value: retard,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <p className="text-sm text-slate-500">{stat.title}</p>

          <p className="mt-2 text-3xl font-bold text-slate-800">{stat.value}</p>
        </Card>
      ))}
    </div>
  );
}
