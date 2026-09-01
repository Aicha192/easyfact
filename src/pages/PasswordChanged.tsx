import { Link } from 'react-router-dom';
import { CircleCheckBig } from 'lucide-react';

import AuthLayout from '../layouts/AuthLayout';
import Button from '../components/ui/Button';

export default function PasswordChanged() {
  return (
    <AuthLayout>
      <div>
        {/* Icône */}

        <div
          className="
            mx-auto
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-full
            bg-emerald-100
            text-emerald-600
          "
        >
          <CircleCheckBig size={42} />
        </div>

        <h2
          className="
    mt-8
    text-2xl
    font-bold
    text-gray-800
    sm:text-3xl
  "
        >
          Mot de passe modifié !
        </h2>

        <p
          className="
            mt-4
            leading-7
            text-gray-500
          "
        >
          Votre mot de passe a été modifié avec succès.
        </p>

        <p
          className="
            mt-2
            leading-7
            text-gray-500
          "
        >
          Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
        </p>

        <div className="mt-8">
          <Link to="/login">
            <Button>Retour à la connexion</Button>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
