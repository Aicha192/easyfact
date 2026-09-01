import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import { DollarSign, Users, FileText, TrendingUp } from 'lucide-react';
import type { Facture } from '../../types/facture';
import type { Client } from '../../types/client';
import type { Produit } from '../../types/produit';
import StatCard from '../../components/dashboard/StatCard';
import RevenueChart from '../../components/dashboard/RevenueChart';
import RecentInvoices from '../../components/dashboard/RecentInvoices';
import QuickActions from '../../components/dashboard/QuickActions';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
const [facturesBackend, setFacturesBackend] = useState<Facture[]>([]);
const [clientsBackend, setClientsBackend] = useState<Client[]>([]);
const [produitsBackend, setProduitsBackend] = useState<Produit[]>([]);

useEffect(() => {
  api.get<Facture[]>('http://localhost:3000/factures')
    .then((response) => {
      setFacturesBackend(response.data);
    })
    .catch((error) => {
      console.error('Erreur factures:', error);
    });

  api.get<Client[]>('http://localhost:3000/clients')
    .then((response) => {
      setClientsBackend(response.data);
    })
    .catch((error) => {
      console.error('Erreur clients:', error);
    });

  api.get<Produit[]>('http://localhost:3000/produits')
    .then((response) => {
      setProduitsBackend(response.data);
    })
    .catch((error) => {
      console.error('Erreur produits:', error);
    });
}, []);

  const navigate = useNavigate();

  const totalFactures = facturesBackend.length;

const chiffreAffaires = facturesBackend
  .filter((f) => f.statut === 'Payée')
  .reduce((total, f) => total + f.montantTTC, 0);

const totalClients = clientsBackend.length;

const totalProduits = produitsBackend.length;

  const cards = [
    {
      title: 'Revenus',
      value: `${chiffreAffaires.toLocaleString()} FCFA`,
      icon: DollarSign,
    },
    {
      title: 'Clients',
      value: totalClients.toString(),
      icon: Users,
    },
    {
      title: 'Factures',
      value: totalFactures.toString(),
      icon: FileText,
    },
    {
      title: 'Produits',
      value: totalProduits.toString(),
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Tableau de bord</h1>

      <p className="mt-2 text-xl font-medium text-gray-500 sm:text-2xl lg:text-3xl">
        Bienvenue sur EasyFact 👋
      </p>

      <p className="text-sm text-gray-400">
        Aujourd'hui : {new Date().toLocaleDateString('fr-FR')}
      </p>

      {/* Cartes */}
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
          />
        ))}
      </div>

      {/* Graphique + Actions */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>

        <QuickActions
          onNewFacture={() => navigate('/factures')}

          onNewClient={() => navigate('/clients')}

          onNewProforma={() => navigate('/proformas')}
        />
      </div>

      {/* Dernières factures */}
      <div className="mt-8">
        <RecentInvoices />
      </div>
    </div>
  );
}
