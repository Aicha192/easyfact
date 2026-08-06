import { useState } from "react";
import {
  Building2,
  MapPin,
  FileText,
  CreditCard,
  Image,
  Save,
} from "lucide-react";
import { useParametresStore } from "../../store/parametresStore";

export default function Parametres() {
  const { parametres, updateParametres } = useParametresStore();

  const [form, setForm] = useState(parametres);

  const [logoPreview, setLogoPreview] = useState(parametres.logo ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.nomEntreprise.trim()) {
      alert("Le nom de l'entreprise est obligatoire.");

      return;
    }

    updateParametres(form);

    alert("Paramètres enregistrés.");
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

        <div className="rounded-xl border bg-white p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="text-emerald-600" />

            <h2 className="text-xl font-semibold">Informations entreprise</h2>
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

        <div className="rounded-xl border bg-white p-6 space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="text-emerald-600" />

            <h2 className="text-xl font-semibold">Coordonnées</h2>
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

        <div className="rounded-xl border bg-white p-6 space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="text-emerald-600" />

            <h2 className="text-xl font-semibold">Informations légales</h2>
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

        <div className="rounded-xl border bg-white p-6 space-y-4">
          <div className="flex items-center gap-2">
            <CreditCard className="text-emerald-600" />

            <h2 className="text-xl font-semibold">Facturation</h2>
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

        <div className="rounded-xl border bg-white p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Image className="text-emerald-600" />

            <h2 className="text-xl font-semibold">Logo de l'entreprise</h2>
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
                  setLogoPreview("");

                  setForm({
                    ...form,
                    logo: "",
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
    flex
    items-center
    gap-2
    rounded-xl
    bg-emerald-600
    px-5
    py-3
    text-white
    hover:bg-emerald-700
  "
        >
          <Save size={18} />
          Enregistrer
        </button>
      </form>
    </div>
  );
}
