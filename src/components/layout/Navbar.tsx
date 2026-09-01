import { Bell, Search, Menu } from 'lucide-react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { useClientStore } from '../../store/clientStore';
import { useFactureStore } from '../../store/factureStore';
import { useProduitStore } from '../../store/produitStore';
import { useProformaStore } from '../../store/proformaStore';
import { useAuthStore } from '../../store/authStore';
import NotificationDropdown from './NotificationDropdown';
import { useNotificationStore } from '../../store/notificationStore';

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');

  const [openNotifications, setOpenNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const clients = useClientStore((state) => state.clients);

  const factures = useFactureStore((state) => state.factures);

  const produits = useProduitStore((state) => state.produits);

  const proformas = useProformaStore((state) => state.proformas);

  const user = useAuthStore((state) => state.user);

  const notifications = useNotificationStore((state) => state.notifications);

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

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

  useOnClickOutside(notificationRef, () => {
    setOpenNotifications(false);
  });

  return (
    <header className="flex items-center justify-between gap-3 rounded-2xl bg-white px-3 py-3 shadow-sm sm:px-4 sm:py-4 lg:px-6 lg:py-4">
      {/* Partie gauche */}
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        {/* Menu mobile */}
        <button
          onClick={onMenuClick}
          className="
        shrink-0
        rounded-xl
        bg-slate-100
        p-3
        transition
        hover:bg-slate-200
        lg:hidden
      "
          aria-label="Ouvrir le menu"
        >
          <Menu size={22} />
        </button>

        {/* Barre de recherche */}
        <div className="relative min-w-0 flex-1 max-w-96">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full min-w-0 rounded-xl border border-gray-300 py-2.5 pl-10 pr-3 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 sm:py-3 sm:pr-4 sm:text-base"
          />
          {search.trim() !== '' && (
            <div className="absolute left-0 right-0 top-14 z-50 max-h-[70vh] overflow-y-auto rounded-xl border bg-white shadow-xl sm:top-16 sm:max-h-96">
              {/* CLIENTS */}
              {clientResults.length > 0 && (
                <div>
                  <h3 className="border-b bg-slate-50 px-3 py-2 text-[11px] font-bold uppercase text-slate-500 sm:px-4 sm:text-xs">
                    Clients
                  </h3>

                  {clientResults.map((client) => (
                    <button
                      key={client.id}
                      onClick={() => {
                        navigate('/clients', {
                          state: {
                            clientId: client.id,
                          },
                        });

                        setSearch('');
                        setSearch('');
                      }}
                      className="block w-full border-b px-3 py-2.5 text-left hover:bg-slate-100 sm:px-4 sm:py-3"
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
                  <h3 className="border-b bg-slate-50 px-3 py-2 text-[11px] font-bold uppercase text-slate-500 sm:px-4 sm:text-xs">
                    Factures
                  </h3>

                  {factureResults.map((facture) => (
                    <button
                      key={facture.id}
                      onClick={() => {
                        navigate('/factures', {
                          state: {
                            previewId: facture.id,
                          },
                        });

                        setSearch('');
                      }}
                      className="block w-full border-b px-3 py-2.5 text-left hover:bg-slate-100 sm:px-4 sm:py-3"
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
                  <h3 className="border-b bg-slate-50 px-3 py-2 text-[11px] font-bold uppercase text-slate-500 sm:px-4 sm:text-xs">
                    Proformas
                  </h3>

                  {proformaResults.map((proforma) => (
                    <button
                      key={proforma.id}
                      onClick={() => {
                        navigate('/proformas', {
                          state: {
                            previewId: proforma.id,
                          },
                        });

                        setSearch('');
                        setSearch('');
                      }}
                      className="block w-full border-b px-3 py-2.5 text-left hover:bg-slate-100 sm:px-4 sm:py-3"
                    >
                      <p className="font-medium">{proforma.numero}</p>

                      <p className="text-sm text-slate-500">
                        {proforma.client}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {/* PRODUITS */}
              {produitResults.length > 0 && (
                <div>
                  <h3 className="border-b bg-slate-50 px-3 py-2 text-[11px] font-bold uppercase text-slate-500 sm:px-4 sm:text-xs">
                    Produits
                  </h3>

                  {produitResults.map((produit) => (
                    <button
                      key={produit.id}
                      onClick={() => {
                        navigate('/produits', {
                          state: {
                            produitId: produit.id,
                          },
                        });

                        setSearch('');
                        setSearch('');
                      }}
                      className="block w-full border-b px-3 py-2.5 text-left hover:bg-slate-100 sm:px-4 sm:py-3"
                    >
                      <p className="font-medium">{produit.nom}</p>

                      <p className="text-sm text-slate-500">
                        {produit.prix.toLocaleString('fr-FR')} FCFA
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
      </div>

      {/* Partie droite */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-5">
        {/* Notifications */}
        <div ref={notificationRef} className="relative">
          <button
            onClick={() => setOpenNotifications(!openNotifications)}
            className="relative rounded-xl bg-slate-100 p-3 transition hover:bg-slate-200"
          >
            <Bell size={20} />

            {unreadCount > 0 && (
              <span
                className="
          absolute
          -right-1
          -top-1
          flex
          h-5
          min-w-[20px]
          items-center
          justify-center
          rounded-full
          bg-red-500
          px-1
          text-xs
          font-bold
          text-white
        "
              >
                {unreadCount}
              </span>
            )}
          </button>

          {openNotifications && <NotificationDropdown />}
        </div>

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
                ?.split(' ')
                .map((word) => word[0])
                .join('')
                .slice(0, 2)
            )}
          </div>

          <div className="hidden sm:block">
            <h3 className="font-semibold">{user?.nom}</h3>

            <p className="text-sm text-gray-500">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
