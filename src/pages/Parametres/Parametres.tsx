import { useEffect, useState } from 'react';
import {
  Building2,
  MapPin,
  FileText,
  CreditCard,
  Image,
  Save,
} from 'lucide-react';
import { useParametresStore } from '../../store/parametresStore';
import api from '../../lib/axios';
import { useAuthStore } from '../../store/authStore';

export default function Parametres() {
  const { parametres, updateParametres } = useParametresStore();

  const [form, setForm] = useState({
  nomEntreprise: parametres.nomEntreprise ?? 'EasyFact',
  responsable: parametres.responsable ?? '',
  adresse: parametres.adresse ?? '',
  telephone: parametres.telephone ?? '',
  email: parametres.email ?? '',
  siteWeb: parametres.siteWeb ?? '',
  ninea: parametres.ninea ?? '',
  rccm: parametres.rccm ?? '',
  devise: parametres.devise ?? 'FCFA',
  conditionsPaiement:
    parametres.conditionsPaiement ?? 'Paiement à réception',
  logo: parametres.logo ?? '',
});

  const [logoPreview, setLogoPreview] = useState(parametres.logo ?? '');

  useEffect(() => {
  console.log('TOKEN =', useAuthStore.getState().accessToken);

  api
    .get('/parametres')
    .then((response) => {
      console.log('PARAMETRES RECUS =', response.data);

      const data = response.data;

      const safeParametres = {
        nomEntreprise: data?.nomEntreprise ?? 'EasyFact',
        responsable: data?.responsable ?? '',
        adresse: data?.adresse ?? '',
        telephone: data?.telephone ?? '',
        email: data?.email ?? '',
        siteWeb: data?.siteWeb ?? '',
        ninea: data?.ninea ?? '',
        rccm: data?.rccm ?? '',
        devise: data?.devise ?? 'FCFA',
        conditionsPaiement:
          data?.conditionsPaiement ?? 'Paiement à réception',
        logo: data?.logo ?? '',
      };

      console.log('PARAMETRES NORMALISES =', safeParametres);

      updateParametres(safeParametres);
      setForm(safeParametres);
      setLogoPreview(safeParametres.logo);
    })
    .catch((error) => {
      console.error(
        'Erreur lors de la récupération des paramètres:',
        error,
      );
    });
}, [updateParametres]);

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  if (!form.nomEntreprise?.trim()) {
    alert("Le nom de l'entreprise est obligatoire.");
    return;
  }

  try {
    const response = await api.put('/parametres', form);

    console.log(
      'Paramètres enregistrés depuis NestJS:',
      response.data,
    );

    updateParametres(response.data.parametres);
    setForm(response.data.parametres);
    setLogoPreview(response.data.parametres.logo ?? '');

    alert('Paramètres enregistrés.');
  } catch (error) {
    console.error(
      'Erreur lors de l’enregistrement des paramètres:',
      error,
    );

    alert('Impossible d’enregistrer les paramètres.');
  }
}

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const logo = reader.result as string;

      setLogoPreview(logo);

      setForm({
        ...form,
        logo,
      });
    };

    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Paramètres</h1>

        <p className="text-slate-500">
          Configurez les informations de votre entreprise.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ENTREPRISE */}

        <div className="space-y-4 rounded-xl border bg-white p-4 sm:p-6">
          <div className="flex min-w-0 items-center gap-2">
            <Building2 className="shrink-0 text-emerald-600" />

            <h2 className="text-lg font-semibold sm:text-xl">
              Informations entreprise
            </h2>
          </div>

          <input
            className="w-full rounded-lg border p-3"
            placeholder="Nom de l'entreprise"
            value={form.nomEntreprise}
            onChange={(e) =>
              setForm({
                ...form,
                nomEntreprise: e.target.value,
              })
            }
          />

          <input
            className="w-full rounded-lg border p-3"
            placeholder="Responsable"
            value={form.responsable}
            onChange={(e) =>
              setForm({
                ...form,
                responsable: e.target.value,
              })
            }
          />
        </div>

        {/* COORDONNEES */}

        <div className="space-y-4 rounded-xl border bg-white p-4 sm:p-6">
          <div className="flex min-w-0 items-center gap-2">
            <MapPin className="shrink-0 text-emerald-600" />

            <h2 className="text-lg font-semibold sm:text-xl">Coordonnées</h2>
          </div>

          <input
            className="w-full rounded-lg border p-3"
            placeholder="Adresse"
            value={form.adresse}
            onChange={(e) =>
              setForm({
                ...form,
                adresse: e.target.value,
              })
            }
          />

          <div className="grid md:grid-cols-2 gap-4">
            <input
              className="rounded-lg border p-3"
              placeholder="Téléphone"
              value={form.telephone}
              onChange={(e) =>
                setForm({
                  ...form,
                  telephone: e.target.value,
                })
              }
            />

            <input
              className="rounded-lg border p-3"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />
          </div>

          <input
            className="w-full rounded-lg border p-3"
            placeholder="Site web"
            value={form.siteWeb}
            onChange={(e) =>
              setForm({
                ...form,
                siteWeb: e.target.value,
              })
            }
          />
        </div>
        {/* INFORMATIONS LEGALES */}

        <div className="space-y-4 rounded-xl border bg-white p-4 sm:p-6">
          <div className="flex min-w-0 items-center gap-2">
            <FileText className="shrink-0 text-emerald-600" />

            <h2 className="text-lg font-semibold sm:text-xl">
              Informations légales
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              className="rounded-lg border p-3"
              placeholder="NINEA"
              value={form.ninea}
              onChange={(e) =>
                setForm({
                  ...form,
                  ninea: e.target.value,
                })
              }
            />

            <input
              className="rounded-lg border p-3"
              placeholder="RCCM"
              value={form.rccm}
              onChange={(e) =>
                setForm({
                  ...form,
                  rccm: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* FACTURATION */}

        <div className="space-y-4 rounded-xl border bg-white p-4 sm:p-6">
          <div className="flex min-w-0 items-center gap-2">
            <CreditCard className="shrink-0 text-emerald-600" />

            <h2 className="text-lg font-semibold sm:text-xl">Facturation</h2>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Devise</label>

            <select
              className="w-full rounded-lg border p-3"
              value={form.devise}
              onChange={(e) =>
                setForm({
                  ...form,
                  devise: e.target.value,
                })
              }
            >
              <option value="FCFA">FCFA</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Conditions de paiement
            </label>

            <textarea
              className="w-full rounded-lg border p-3"
              rows={3}
              value={form.conditionsPaiement}
              onChange={(e) =>
                setForm({
                  ...form,
                  conditionsPaiement: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* LOGO */}

        <div className="space-y-4 rounded-xl border bg-white p-4 sm:p-6">
          <div className="flex min-w-0 items-center gap-2">
            <Image className="shrink-0 text-emerald-600" />

            <h2 className="text-lg font-semibold sm:text-xl">
              Logo de l'entreprise
            </h2>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="w-full rounded-lg border p-3"
          />

          {logoPreview && (
            <div className="mt-4 space-y-3">
              <img
                src={logoPreview}
                alt="Logo"
                className="h-24 w-24 rounded-lg border object-contain"
              />

              <button
                type="button"
                onClick={() => {
                  setLogoPreview('');

                  setForm({
                    ...form,
                    logo: '',
                  });
                }}
                className="rounded-lg bg-red-100 px-4 py-2 text-red-600 hover:bg-red-200"
              >
                Supprimer le logo
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="
    flex w-full items-center justify-center
    gap-2 rounded-xl
    bg-emerald-600
    px-5 py-3
    text-white
    hover:bg-emerald-700
    sm:w-auto
  "
        >
          <Save size={18} />
          Enregistrer
        </button>
      </form>
    </div>
  );
}
