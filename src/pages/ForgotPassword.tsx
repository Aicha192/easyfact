import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";

import AuthLayout from "../layouts/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  function handleSubmit() {
    if (!email.trim()) {
      toast.error("Veuillez saisir votre adresse e-mail.");

      return;
    }

    // Simulation d'envoi du lien
    navigate("/email-sent", {
      state: {
        email,
      },
    });
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
          Mot de passe oublié ?
        </h2>

        <p
          className="
          mt-3
          text-gray-500
          leading-7
        "
        >
          Pas de souci ! Entrez votre adresse e-mail associée à votre compte.
        </p>

        <div className="mt-8">
          <Input
            label="Adresse e-mail"
            type="email"
            placeholder="nom@email.com"
            icon={<Mail size={20} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="mt-6">
            <Button onClick={handleSubmit}>Continuer</Button>
          </div>
        </div>

        <p
          className="
          mt-6
          text-center
          text-gray-600
        "
        >
          <Link
            to="/login"
            className="
              font-semibold
              text-emerald-600
              hover:underline
            "
          >
            ← Retour à la connexion
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
