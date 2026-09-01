import type { ReactNode } from 'react';
import { FileText } from 'lucide-react';
import illustration from '../assets/images/easyfact.png';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Partie gauche */}
      <div
        className=" hidden lg:flex w-1/2 flex-col justify-center bg-gradient-to-br
    from-emerald-600 to-emerald-700 px-14 text-white "
      >
        {/* Logo */}

        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-white p-4 shadow-xl">
            <FileText size={34} className="text-emerald-600" />
          </div>

          <div className="text-left">
            <h1 className="text-5xl font-extrabold">EasyFact</h1>

            <p className="text-emerald-100">Gestion de facturation</p>
          </div>
        </div>

        {/* Titre */}

        <h2 className="mt-12 max-w-xl text-4xl font-bold leading-tight">
          Simplifiez la gestion de votre entreprise.
        </h2>

        {/* Description */}

        <p className=" mt-6 max-w-lg text-lg leading-8 text-emerald-100">
          Gérez vos clients, vos factures et vos proformas dans une interface
          moderne, intuitive et rapide.
        </p>

        {/* Illustration */}

        <div className="mt-10 flex justify-center">
          <img
            src={illustration}
            alt="EasyFact"
            className="w-[300px] xl:w-[360px] drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Partie droite */}

      <div className="flex-1 overflow-y-auto bg-slate-100 ">
        <div className=" flex min-h-full items-center justify-center p-10 ">
          {children}
        </div>
      </div>
    </div>
  );
}
