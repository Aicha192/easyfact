import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import api from '../../lib/axios';
import AuthLayout from '../../layouts/AuthLayout';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../../store/notificationStore';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((state) => state.login);
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      console.log('JWT reçu depuis NestJS:', response.data.access_token);

      const user = response.data.user;

      toast.success(`Bienvenue ${user.nom} !`);
      login(user, response.data.access_token);

      addNotification({
        title: 'Connexion réussie',
        message: `Bienvenue ${user.nom} !`,
        createdAt: Date.now(),
        type: 'auth',
      });

      navigate('/dashboard');
    } catch (error) {
      toast.error('Email ou mot de passe incorrect.');
    }
  }

  return (
    <AuthLayout>
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Bon retour 👋</h2>

        <p className="mt-2 text-gray-500">
          Connectez-vous à votre compte EasyFact.
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Email
            </label>

            <div className="relative">
              <Mail
                size={20}
                className="absolute left-3 top-3.5 text-gray-400"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@email.com"
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3
  focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Mot de passe
            </label>

            <div className="relative">
              <Lock
                size={20}
                className="absolute left-3 top-3.5 text-gray-400"
              />

              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full rounded-lg border border-gray-300 pl-10 pr-12 py-3
  focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" className="accent-emerald-600" />
              Se souvenir de moi
            </label>

            <Link
              to="/forgot-password"
              className="
      text-sm
      font-medium
      text-emerald-600
      hover:underline
    "
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <button
            type="submit"
            className="
    w-full
    rounded-lg
    bg-emerald-600
    py-3
    text-white
    font-semibold
    hover:bg-emerald-700
    transition
  "
          >
            Se connecter
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Pas encore de compte ?
          <Link
            to="/register"
            className="ml-1 font-semibold text-emerald-600 sm:ml-2"
          >
            S'inscrire
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
