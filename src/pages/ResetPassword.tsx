import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';

import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useNotificationStore } from '../store/notificationStore';

export default function ResetPassword() {
  const navigate = useNavigate();

  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    if (!password.trim()) {
      toast.error('Veuillez saisir un nouveau mot de passe.');
      return;
    }

    if (password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    if (password !== confirmation) {
      toast.error('Les mots de passe ne correspondent pas.');
      return;
    }

    const token = new URLSearchParams(window.location.search).get('token');

    if (!token) {
      toast.error('Lien de réinitialisation invalide.');
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        'https://easyfact-backend-production.up.railway.app/auth/reset-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.message ||
            'Impossible de réinitialiser le mot de passe.',
        );
        return;
      }

      toast.success('Mot de passe modifié avec succès.');

      addNotification({
        title: 'Mot de passe modifié',
        message: 'Votre mot de passe a été changé avec succès.',
        createdAt: Date.now(),
        type: 'auth',
      });

      navigate('/password-changed');
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
        <h2
          className="
            text-3xl
            font-bold
            text-gray-800
          "
        >
          Créer un nouveau mot de passe
        </h2>

        <p
          className="
            mt-3
            text-gray-500
          "
        >
          Choisissez un mot de passe sécurisé pour protéger votre compte.
        </p>

        <div className="mt-8 space-y-5">
          <Input
            label="Nouveau mot de passe"
            type="password"
            icon={<Lock size={20} />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            label="Confirmer le mot de passe"
            type="password"
            icon={<Lock size={20} />}
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
          />

          <Button onClick={handleSubmit}>
            {isLoading
              ? 'Modification en cours...'
              : 'Changer le mot de passe'}
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}