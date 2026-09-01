import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import toast from 'react-hot-toast';

import AuthLayout from '../layouts/AuthLayout';
import Button from '../components/ui/Button';

export default function EmailSent() {
  const location = useLocation();

  const navigate = useNavigate();

  const email = location.state?.email || 'votre adresse e-mail';

  function handleResend() {
    toast.success(`Le lien a été renvoyé à ${email}`);
  }

  function handleContinue() {
    navigate('/reset-password');
  }

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
          <MailCheck size={40} />
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
          Vérifiez votre boîte e-mail
        </h2>

        <p
          className="
            mt-4
            text-gray-500
            leading-7
          "
        >
          Nous avons envoyé un lien de réinitialisation à :
        </p>

        <p
          className="
  mt-3
  break-words
  font-semibold
  text-emerald-600
"
        >
          {email}
        </p>

        <p
          className="
            mt-5
            text-gray-500
            leading-7
          "
        >
          Cliquez sur le lien reçu dans votre boîte e-mail pour créer un nouveau
          mot de passe.
        </p>

        <div className="mt-8 space-y-4">
          <Button onClick={handleResend} className="w-full">
            Renvoyer le lien
          </Button>

          <button
            onClick={handleContinue}
            className="
    w-full
    rounded-xl
    border
    border-emerald-600
    py-3
    font-semibold
    text-emerald-600
    transition
    hover:bg-emerald-50
  "
          >
            Continuer (simulation)
          </button>

          <Link
            to="/login"
            className="
      block
      text-sm
      font-medium
      text-emerald-600
      hover:underline
    "
          >
            ← Retour à la connexion
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
