import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { useAuthStore } from '../../store/authStore';
import type { User } from '../../types/user';
import { Pencil } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useNotificationStore } from '../../store/notificationStore';

interface ProfileResponse {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  role: string;
  avatar: string | null;
}

interface UpdateProfileResponse {
  message: string;
  user: ProfileResponse;
}

export default function Profile() {
  const user = useAuthStore((state) => state.user);

  const updateAuthUser = useAuthStore((state) => state.updateUser);

  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [avatar, setAvatar] = useState<string | undefined>();

  const [ancienPassword, setAncienPassword] = useState('');
  const [nouveauPassword, setNouveauPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /*
   * Récupération du vrai utilisateur depuis NestJS
   */
  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await api.get<ProfileResponse>(
          '/users/me',
        );

        const backendUser = response.data;

        setNom(backendUser.nom);
        setTelephone(backendUser.telephone);
        setAvatar(backendUser.avatar ?? undefined);

        /*
         * On synchronise également Zustand.
         *
         * Attention : on conserve le token et les autres
         * informations déjà présentes dans le store.
         */
        if (user) {
          const userForStore: User = {
            ...user,
            id: backendUser.id,
            nom: backendUser.nom,
            email: backendUser.email,
            telephone: backendUser.telephone,
            role: backendUser.role as User['role'],
            avatar: backendUser.avatar ?? undefined,
          };

          updateAuthUser(userForStore);
        }
      } catch (error) {
        console.error(
          'Erreur lors du chargement du profil :',
          error,
        );

        toast.error(
          'Impossible de récupérer les informations du profil.',
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  /*
   * Sélection de l'avatar
   */
  function handleAvatarChange(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        'Formats autorisés : JPG, PNG ou WEBP.',
      );

      e.target.value = '';

      return;
    }

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error(
        'La photo ne doit pas dépasser 2 Mo.',
      );

      e.target.value = '';

      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setAvatar(reader.result as string);

      toast.success('Photo sélectionnée.');
    };

    reader.readAsDataURL(file);
  }

  /*
   * Enregistrement du profil
   */
  async function handleSave() {
    if (!nom.trim()) {
      toast.error('Le nom est obligatoire.');
      return;
    }

    if (!telephone.trim()) {
      toast.error('Le téléphone est obligatoire.');
      return;
    }

    /*
     * Si l'utilisateur veut changer son mot de passe,
     * on vérifie seulement que les champs sont cohérents.
     *
     * La vérification de l'ancien mot de passe est faite
     * par NestJS avec bcrypt.
     */
    if (
      ancienPassword ||
      nouveauPassword ||
      confirmation
    ) {
      if (!ancienPassword) {
        toast.error(
          "Veuillez saisir votre ancien mot de passe.",
        );
        return;
      }

      if (!nouveauPassword) {
        toast.error(
          'Veuillez saisir le nouveau mot de passe.',
        );
        return;
      }

      if (nouveauPassword.length < 6) {
        toast.error(
          'Le nouveau mot de passe doit contenir au moins 6 caractères.',
        );
        return;
      }

      if (nouveauPassword !== confirmation) {
        toast.error(
          'Les mots de passe ne correspondent pas.',
        );
        return;
      }
    }

    setSaving(true);

    try {
      const response =
        await api.put<UpdateProfileResponse>(
          '/users/me',
          {
            nom: nom.trim(),
            telephone: telephone.trim(),
            avatar: avatar ?? null,

            ...(ancienPassword &&
            nouveauPassword
              ? {
                  ancienPassword,
                  nouveauPassword,
                }
              : {}),
          },
        );

      const backendUser = response.data.user;

      /*
       * IMPORTANT :
       * Le backend ne renvoie jamais le password.
       * On conserve donc uniquement les informations
       * déjà présentes dans Zustand.
       */
      if (user) {
        const userForStore: User = {
          ...user,
          id: backendUser.id,
          nom: backendUser.nom,
          email: backendUser.email,
          telephone: backendUser.telephone,
          role: backendUser.role as User['role'],
          avatar: backendUser.avatar ?? undefined,
        };

        updateAuthUser(userForStore);
      }

      setNom(backendUser.nom);
      setTelephone(backendUser.telephone);
      setAvatar(
        backendUser.avatar ?? undefined,
      );

      setAncienPassword('');
      setNouveauPassword('');
      setConfirmation('');

      toast.success(
        'Profil mis à jour avec succès.',
      );

      addNotification({
        title: 'Profil mis à jour',
        message:
          'Vos informations personnelles ont été modifiées.',
        createdAt: Date.now(),
        type: 'profil',
      });
    } catch (error: any) {
      console.error(
        'Erreur lors de la modification du profil :',
        error,
      );

      const message =
        error?.response?.data?.message;

      if (Array.isArray(message)) {
        toast.error(message.join(', '));
      } else if (message) {
        toast.error(message);
      } else {
        toast.error(
          'Impossible de mettre à jour le profil.',
        );
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-slate-500">
          Chargement du profil...
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Mon Profil
      </h1>

      {/* Informations personnelles */}

      <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        <div className="mb-10 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
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
                  .split(' ')
                  .map((word) => word[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()
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
              <Pencil
                size={18}
                className="text-emerald-600"
              />

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>

          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold">
              {nom}
            </h2>

            <p className="text-slate-500">
              {user.role}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Cliquez sur le crayon pour modifier votre
              photo.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Input
            label="Nom complet"
            value={nom}
            onChange={(e) =>
              setNom(e.target.value)
            }
          />

          <Input
            label="Email"
            type="email"
            value={user.email}
            disabled
          />

          <Input
            label="Téléphone"
            value={telephone}
            onChange={(e) =>
              setTelephone(e.target.value)
            }
          />

          <Input
            label="Rôle"
            value={user.role}
            disabled
          />
        </div>
      </div>

      {/* Sécurité */}

      <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        <h2 className="mb-6 text-xl font-semibold">
          Modifier le mot de passe
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <Input
            label="Ancien mot de passe"
            type="password"
            value={ancienPassword}
            onChange={(e) =>
              setAncienPassword(e.target.value)
            }
          />

          <Input
            label="Nouveau mot de passe"
            type="password"
            value={nouveauPassword}
            onChange={(e) =>
              setNouveauPassword(e.target.value)
            }
          />

          <Input
            label="Confirmation"
            type="password"
            value={confirmation}
            onChange={(e) =>
              setConfirmation(e.target.value)
            }
          />
        </div>

        <div className="mt-6 flex justify-stretch sm:justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto"
          >
            {saving
              ? 'Enregistrement...'
              : 'Enregistrer les modifications'}
          </Button>
        </div>
      </div>
    </div>
  );
}