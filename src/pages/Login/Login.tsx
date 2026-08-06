import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import toast from "react-hot-toast";

import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useUserStore } from "../../store/userStore";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const users = useUserStore((state) => state.users);
  const login = useAuthStore((state) => state.login);

  const navigate = useNavigate();

  function handleForgotPassword() {
    const email = resetEmail.trim().toLowerCase();

    if (!email) {
      toast.error("Veuillez saisir votre adresse e-mail.");
      return;
    }

    const user = users.find((u) => u.email.toLowerCase() === email);

    if (!user) {
      toast.error("Aucun compte n'est associé à cette adresse e-mail.");
      return;
    }

    toast.success(
      `Un lien de réinitialisation a été envoyé à ${email} (simulation).`,
    );

    setForgotOpen(false);
    setResetEmail("");
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      toast.error("Email ou mot de passe incorrect.");

      return;
    }

    toast.success(`Bienvenue ${user.nom} !`);
    login(user);

    navigate("/dashboard");
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
                type={showPassword ? "text" : "password"}
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

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setForgotOpen(true)}
              className="text-sm font-medium text-emerald-600 hover:underline"
            >
              Mot de passe oublié ?
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" className="accent-emerald-600" />
              Se souvenir de moi
            </label>
          </div>

          <button className="w-full rounded-lg bg-emerald-600 py-3 text-white font-semibold hover:bg-emerald-700 transition">
            Se connecter
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Pas encore de compte ?
          <Link to="/register" className="ml-2 font-semibold text-emerald-600">
            S'inscrire
          </Link>
        </p>
      </div>

      <Modal
        isOpen={forgotOpen}
        title="Réinitialiser le mot de passe"
        onClose={() => {
          setForgotOpen(false);
          setResetEmail("");
        }}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Saisissez votre adresse e-mail. Si un compte existe, un lien de
            réinitialisation sera simulé.
          </p>

          <Input
            label="Adresse e-mail"
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setForgotOpen(false);
                setResetEmail("");
              }}
              className="rounded-xl border border-slate-300 px-5 py-2 hover:bg-slate-100"
            >
              Annuler
            </button>

            <Button onClick={handleForgotPassword}>Envoyer</Button>
          </div>
        </div>
      </Modal>
    </AuthLayout>
  );
}
