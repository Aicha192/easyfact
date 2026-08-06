import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

export default function MainLayout() {
  return (
    <div className="h-screen overflow-hidden bg-slate-100">

      <div className="flex h-full">

        {/* Sidebar fixe */}
        <Sidebar />

        {/* Partie droite */}
        <div className="ml-72 flex flex-1 flex-col">

          {/* Navbar fixe */}
          <div className="sticky top-0 z-40 bg-slate-100 p-6 pb-0">
            <Navbar />
          </div>

          {/* Contenu scrollable */}
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>

        </div>

      </div>

    </div>
  );
}