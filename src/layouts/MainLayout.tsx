import { Outlet } from 'react-router-dom';
import { useState } from 'react';

import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar desktop */}
      <div className="hidden lg:block">
        <Sidebar isOpen={true} onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Sidebar mobile */}
      <div className="lg:hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Fond sombre mobile */}
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Partie droite */}
      <div className="flex min-w-0 flex-1 flex-col lg:ml-72">
        {/* Navbar */}
        <div className="sticky top-0 z-40 bg-slate-100 p-3 sm:p-4 lg:p-6 lg:pb-0">
          <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        </div>

        {/* Contenu */}
        <main className="min-w-0 flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
