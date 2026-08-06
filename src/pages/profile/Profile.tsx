import { useState } from "react";
import toast from "react-hot-toast";

import { useAuthStore } from "../../store/authStore";
import { useUserStore } from "../../store/userStore";
import type { User } from "../../types/user";
import { Pencil } from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function Profile() {
  const user = useAuthStore((state) => state.user);

  const updateAuthUser = useAuthStore((state) => state.updateUser);

  const updateStoredUser = useUserStore((state) => state.updateUser);

  const [nom, setNom] = useState(user?.nom ?? "");

  const [email, setEmail] = useState(user?.email ?? "");

  const [telephone, setTelephone] = useState(user?.telephone ?? "");

  const [ancienPassword, setAncienPassword] = useState("");

  const [nouveauPassword, setNouveauPassword] = useState("");

  const [confirmation, setConfirmation] = useState("");

  const [avatar, setAvatar] = useState<string | undefined>(user?.avatar);

  if (!user) {
    return null;
  }

  const currentUser = user;

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Formats autorisés : JPG, PNG ou WEBP.");

      e.target.value = "";

      return;
    }

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error("La photo ne doit pas dépasser 2 Mo.");

      e.target.value = "";

      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setAvatar(reader.result as string);

      toast.success("Photo sélectionnée.");
    };

    reader.readAsDataURL(file);
  }

  function handleSave() {
    if (!nom.trim()) {
      toast.error("Le nom est obligatoire.");

      return;
    }

    if (!email.trim()) {
      toast.error("L'email est obligatoire.");

      return;
    }

    if (!telephone.trim()) {
      toast.error("Le téléphone est obligatoire.");

      return;
    }

    let password = user!.password;

    // Modification du mot de passe

    if (ancienPassword || nouveauPassword || confirmation) {
      if (ancienPassword !== user!.password) {
        toast.error("Ancien mot de passe incorrect.");

        return;
      }

      if (nouveauPassword.length < 6) {
        toast.error(
          "Le nouveau mot de passe doit contenir au moins 6 caractères.",
        );

        return;
      }

      if (nouveauPassword !== confirmation) {
        toast.error("Les mots de passe ne correspondent pas.");

        return;
      }

      password = nouveauPassword;
    }

    const updatedUser: User = {
      id: currentUser.id,
      nom,
      email,
      telephone,
      password,
      role: currentUser.role,
      avatar,
    };

    // Mise à jour de la session

    updateAuthUser(updatedUser);

    // Mise à jour de la liste utilisateurs

    updateStoredUser(updatedUser);

    toast.success("Profil mis à jour avec succès.");

    setAncienPassword("");

    setNouveauPassword("");

    setConfirmation("");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mon Profil</h1>

      {/* Informations personnelles */}

      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-10 flex items-center gap-6">
          {/* Avatar */}

          <div className="relative">
            <div
              className="
      flex
      h-24
      w-24
      items-center
      justify-center
      overflow-hidden
      rounded-full
      bg-emerald-600
      text-3xl
      font-bold
      text-white
      shadow-md
    "
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt="Profil"
                  className="h-full w-full object-cover"
                />
              ) : (
                nom
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)
              )}
            </div>

            <label
              className="
      absolute
      -bottom-1
      -right-1
      flex
      h-9
      w-9
      cursor-pointer
      items-center
      justify-center
      rounded-full
      bg-white
      shadow-lg
      transition
      hover:scale-105
    "
            >
              <Pencil size={18} className="text-emerald-600" />

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold">{nom}</h2>

            <p className="text-slate-500">{user.role}</p>

            <p className="mt-2 text-xs text-slate-500">
              Cliquez sur le crayon pour modifier votre photo.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Input
            label="Nom complet"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Téléphone"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
          />

          <Input label="Rôle" value={user.role} disabled />
        </div>
      </div>

      {/* Sécurité */}

      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold">Modifier le mot de passe</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <Input
            label="Ancien mot de passe"
            type="password"
            value={ancienPassword}
            onChange={(e) => setAncienPassword(e.target.value)}
          />

          <Input
            label="Nouveau mot de passe"
            type="password"
            value={nouveauPassword}
            onChange={(e) => setNouveauPassword(e.target.value)}
          />

          <Input
            label="Confirmation"
            type="password"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave}>Enregistrer les modifications</Button>
        </div>
      </div>
    </div>
  );
}
