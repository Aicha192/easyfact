import type { Produit } from '../../types/produit';

interface Props {
  produits: Produit[];
}

export default function ProduitStats({ produits }: Props) {
  const total = produits.length;

  const actifs = produits.filter(
    (produit) => produit.statut === 'Actif',
  ).length;

  const services = produits.filter(
    (produit) => produit.categorie === 'Service',
  ).length;

  const produitsPhysiques = produits.filter(
    (produit) => produit.categorie === 'Produit',
  ).length;

  const cards = [
    {
      title: 'Total',
      value: total,
    },
    {
      title: 'Produits',
      value: produitsPhysiques,
    },
    {
      title: 'Services',
      value: services,
    },
    {
      title: 'Actifs',
      value: actifs,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.title} className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">{card.title}</p>

          <h2 className="mt-2 text-3xl font-bold">{card.value}</h2>
        </div>
      ))}
    </div>
  );
}
