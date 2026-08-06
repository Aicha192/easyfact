import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  FileSpreadsheet,
  Settings,
  LogOut,
} from "lucide-react";
import { Package } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { UserCircle } from "lucide-react";

const menus = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Factures", path: "/factures", icon: FileText },
  { name: "Proformas", path: "/proformas", icon: FileSpreadsheet },
  { name: "Clients", path: "/clients", icon: Users },
  { name: "Produits", path: "/produits", icon: Package },
  { name: "Mon Profil", path: "/profil", icon: UserCircle },
  { name: "Paramètres", path: "/parametres", icon: Settings },
];

export default function Sidebar() {
  const logout = useAuthStore((state) => state.logout);

  // const user = useAuthStore((state) => state.user);

  const navigate = useNavigate();

  function handleLogout() {
    logout();

    navigate("/login");
  }

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-72 flex-col bg-emerald-600 text-white">
      {/* Logo */}

      <div className="flex items-center gap-4 p-6">
        <div
          className="
      flex
      h-14
      w-14
      items-center
      justify-center
      rounded-2xl
      bg-white
      font-extrabold
      text-emerald-600
      text-xl
      shadow-lg
    "
        >
          EF
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-wide">EasyFact</h1>

          <p className="text-sm text-emerald-100">Gestion de facturation</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-2 p-5">
        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <NavLink
              key={menu.path}
              to={menu.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-white text-emerald-600 shadow-md"
                    : "hover:bg-emerald-700"
                }`
              }
            >
              <Icon size={20} />
              <span>{menu.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-emerald-500 p-5">
       
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-emerald-700"
        >
          <LogOut size={20} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
