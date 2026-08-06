import { DollarSign, Users, FileText, TrendingUp } from "lucide-react";

import StatCard from "../../components/dashboard/StatCard";
import RevenueChart from "../../components/dashboard/RevenueChart";
import RecentInvoices from "../../components/dashboard/RecentInvoices";
import QuickActions from "../../components/dashboard/QuickActions";
import { useFactureStore } from "../../store/factureStore";
import { useClientStore } from "../../store/clientStore";
import { useProduitStore } from "../../store/produitStore";
import { useNavigate } from "react-router-dom";
 

export default function Dashboard() {
const factures = useFactureStore((state) => state.factures);

const navigate = useNavigate();

const totalFactures = factures.length;

const chiffreAffaires = factures
  .filter((f) => f.statut === "Payée")
  .reduce((total, f) => total + f.montantTTC, 0);

const clients = useClientStore((state) => state.clients);

const produits = useProduitStore((state) => state.produits);

const totalClients = clients.length;

const totalProduits = produits.length;

const cards = [
  {
    title: "Revenus",
    value: `${chiffreAffaires.toLocaleString()} FCFA`,
    icon: DollarSign,
  },
  {
    title: "Clients",
    value: totalClients.toString(),
    icon: Users,
  },
  {
    title: "Factures",
    value: totalFactures.toString(),
    icon: FileText,
  },
  {
    title: "Produits",
    value: totalProduits.toString(),
    icon: TrendingUp,
  },
];

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Tableau de bord</h1>

      <p className="mt-2 text-3xl text-gray-500">Bienvenue sur EasyFact 👋</p>

      <p className="text-sm text-gray-400">
        Aujourd'hui : {new Date().toLocaleDateString("fr-FR")}
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

  onNewFacture={() =>
    navigate("/factures")
  }

  onNewClient={() =>
    navigate("/clients")
  }

  onNewProforma={() =>
    navigate("/proformas")
  }

/>
      </div>

      {/* Dernières factures */}
      <div className="mt-8">
        <RecentInvoices />
      </div>
    </div>
  );
}
