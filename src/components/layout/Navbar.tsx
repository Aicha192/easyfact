import { Bell, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useClientStore } from "../../store/clientStore";
import { useFactureStore } from "../../store/factureStore";
import { useProduitStore } from "../../store/produitStore";
import { useProformaStore } from "../../store/proformaStore";
import { useAuthStore } from "../../store/authStore";

export default function Navbar() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const clients = useClientStore((state) => state.clients);

  const factures = useFactureStore((state) => state.factures);

  const produits = useProduitStore((state) => state.produits);

  const proformas = useProformaStore((state) => state.proformas);

  const user = useAuthStore((state) => state.user);

  const clientResults = clients.filter((client) =>
    client.nom.toLowerCase().includes(search.toLowerCase()),
  );

  const factureResults = factures.filter(
    (facture) =>
      facture.numero.toLowerCase().includes(search.toLowerCase()) ||
      facture.client.toLowerCase().includes(search.toLowerCase()),
  );

  const produitResults = produits.filter((produit) =>
    produit.nom.toLowerCase().includes(search.toLowerCase()),
  );

  const proformaResults = proformas.filter(
    (proforma) =>
      proforma.numero.toLowerCase().includes(search.toLowerCase()) ||
      proforma.client.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <header className="flex items-center justify-between rounded-2xl bg-white px-6 py-4 shadow-sm">
      {/* Barre de recherche */}
      <div className="relative w-96">
        <Search
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        />

        {search.trim() !== "" && (
          <div className="absolute left-0 right-0 top-16 z-50 max-h-96 overflow-y-auto rounded-xl border bg-white shadow-xl">
            {/* CLIENTS */}
            {clientResults.length > 0 && (
              <div>
                <h3 className="border-b bg-slate-50 px-4 py-2 text-xs font-bold uppercase text-slate-500">
                  Clients
                </h3>

                {clientResults.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => {
                      navigate("/clients", {
                        state: {
                          clientId: client.id,
                        },
                      });

                      setSearch("");
                      setSearch("");
                    }}
                    className="block w-full border-b px-4 py-3 text-left hover:bg-slate-100"
                  >
                    <p className="font-medium">{client.nom}</p>
                    <p className="text-sm text-slate-500">{client.email}</p>
                  </button>
                ))}
              </div>
            )}

            {/* FACTURES */}
            {factureResults.length > 0 && (
              <div>
                <h3 className="border-b bg-slate-50 px-4 py-2 text-xs font-bold uppercase text-slate-500">
                  Factures
                </h3>

                {factureResults.map((facture) => (
                  <button
                    key={facture.id}
                    onClick={() => {
                      navigate("/factures", {
                        state: {
                          previewId: facture.id,
                        },
                      });

                      setSearch("");
                    }}
                    className="block w-full border-b px-4 py-3 text-left hover:bg-slate-100"
                  >
                    <p className="font-medium">{facture.numero}</p>

                    <p className="text-sm text-slate-500">{facture.client}</p>
                  </button>
                ))}
              </div>
            )}

            {/* PROFORMAS */}
            {proformaResults.length > 0 && (
              <div>
                <h3 className="border-b bg-slate-50 px-4 py-2 text-xs font-bold uppercase text-slate-500">
                  Proformas
                </h3>

                {proformaResults.map((proforma) => (
                  <button
                    key={proforma.id}
                    onClick={() => {
                      navigate("/proformas", {
                        state: {
                          previewId: proforma.id,
                        },
                      });

                      setSearch("");
                      setSearch("");
                    }}
                    className="block w-full border-b px-4 py-3 text-left hover:bg-slate-100"
                  >
                    <p className="font-medium">{proforma.numero}</p>

                    <p className="text-sm text-slate-500">{proforma.client}</p>
                  </button>
                ))}
              </div>
            )}

            {/* PRODUITS */}
            {produitResults.length > 0 && (
              <div>
                <h3 className="border-b bg-slate-50 px-4 py-2 text-xs font-bold uppercase text-slate-500">
                  Produits
                </h3>

                {produitResults.map((produit) => (
                  <button
                    key={produit.id}
                    onClick={() => {
                      navigate("/produits", {
                        state: {
                          produitId: produit.id,
                        },
                      });

                      setSearch("");
                      setSearch("");
                    }}
                    className="block w-full border-b px-4 py-3 text-left hover:bg-slate-100"
                  >
                    <p className="font-medium">{produit.nom}</p>

                    <p className="text-sm text-slate-500">
                      {produit.prix.toLocaleString("fr-FR")} FCFA
                    </p>
                  </button>
                ))}
              </div>
            )}

            {clientResults.length === 0 &&
              factureResults.length === 0 &&
              proformaResults.length === 0 &&
              produitResults.length === 0 && (
                <div className="px-4 py-6 text-center text-slate-500">
                  Aucun résultat trouvé
                </div>
              )}
          </div>
        )}
      </div>

      {/* Partie droite */}
      <div className="flex items-center gap-5">
        {/* Notifications */}
        <button className="relative rounded-xl bg-slate-100 p-3 transition hover:bg-slate-200">
          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* Profil */}
        <div className="flex items-center gap-3">
          <div
            className="
    flex
    h-11
    w-11
    items-center
    justify-center
    overflow-hidden
    rounded-full
    bg-emerald-600
    font-bold
    text-white
  "
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.nom}
                className="h-full w-full object-cover"
              />
            ) : (
              user?.nom
                ?.split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
            )}
          </div>

          <div>
            <h3 className="font-semibold">{user?.nom}</h3>

            <p className="text-sm text-gray-500">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
