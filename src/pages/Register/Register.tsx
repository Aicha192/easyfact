import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock } from 'lucide-react';

import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useState } from 'react';
import toast from 'react-hot-toast';

import api from '../../lib/axios';

export default function Register() {
  const navigate = useNavigate();

  const [nom, setNom] = useState('');

  const [email, setEmail] = useState('');

  const [telephone, setTelephone] = useState('');

  const [password, setPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');

async function handleRegister(e: React.FormEvent) {
  e.preventDefault();

  if (!nom || !email || !telephone || !password || !confirmPassword) {
    toast.error('Veuillez remplir tous les champs.');
    return;
  }

  if (password !== confirmPassword) {
    toast.error('Les mots de passe ne correspondent pas.');
    return;
  }

  try {
    const response = await api.post('/auth/register', {
      nom,
      email,
      telephone,
      password,
    });

    console.log('Inscription réussie depuis NestJS:', response.data);

    toast.success('Compte créé avec succès !');

    navigate('/login');
  } catch (error: any) {
    console.error("Erreur lors de l'inscription :", error);

    const message = error?.response?.data?.message;

    if (Array.isArray(message)) {
      toast.error(message.join(', '));
    } else if (message) {
      toast.error(message);
    } else {
      toast.error("Impossible de créer le compte.");
    }
  }
}

  return (
    <AuthLayout>
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Créer un compte</h2>

        <p className="mt-2 text-gray-500">
          Rejoignez EasyFact en quelques secondes.
        </p>

        <form onSubmit={handleRegister} className="mt-8 space-y-5">
          <Input
            label="Nom complet"
            placeholder="Votre nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            icon={<User size={20} />}
          />

          <Input
            label="Email"
            type="email"
            placeholder="nom@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={20} />}
          />

          <Input
            label="Téléphone"
            placeholder="+221 77 000 00 00"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            icon={<Phone size={20} />}
          />

          <Input
            label="Mot de passe"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={20} />}
          />

          <Input
            label="Confirmer le mot de passe"
            type="password"
            placeholder="********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={<Lock size={20} />}
          />

          <Button type="submit">Créer mon compte</Button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Déjà un compte ?
          <Link
            to="/login"
            className="ml-1 font-semibold text-emerald-600 sm:ml-2"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
