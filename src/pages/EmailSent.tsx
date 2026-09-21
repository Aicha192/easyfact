import { Link, useLocation } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';

import AuthLayout from '../layouts/AuthLayout';
import Button from '../components/ui/Button';

export default function EmailSent() {
  const location = useLocation();

  const email = location.state?.email || '';

  const [isLoading, setIsLoading] = useState(false);

  async function handleResend() {
    if (!email) {
      toast.error(
        'Adresse e-mail introuvable. Veuillez refaire une demande.',
      );
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        'https://easyfact-backend-production.up.railway.app/auth/forgot-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.message ||
            'Impossible de renvoyer le lien de réinitialisation.',
        );
        return;
      }

      toast.success(`Un nouveau lien a été envoyé à ${email}.`);
    } catch (error) {
      console.error(error);

      toast.error(
        'Impossible de contacter le serveur. Veuillez réessayer.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div>
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
          {email || 'votre adresse e-mail'}
        </p>

        <p
          className="
            mt-5
            text-gray-500
            leading-7
          "
        >
          Cliquez sur le lien reçu dans votre boîte e-mail pour créer un
          nouveau mot de passe.
        </p>

        <div className="mt-8 space-y-4">
          <Button
            onClick={handleResend}
            className="w-full"
          >
            {isLoading ? 'Envoi en cours...' : 'Renvoyer le lien'}
          </Button>

          <Link
            to="/login"
            className="
              block
              text-center
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