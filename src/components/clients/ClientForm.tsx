import { useState } from 'react';
import Button from '../ui/Button';

export interface ClientFormData {
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  statut: 'Actif' | 'Inactif';
}

interface ClientFormProps {
  initialData?: ClientFormData;
  onSubmit: (client: ClientFormData) => void;
  onCancel: () => void;
}

export default function ClientForm({
  initialData,
  onSubmit,
  onCancel,
}: ClientFormProps) {
  const [form, setForm] = useState<ClientFormData>(
    initialData ?? {
      nom: '',
      email: '',
      telephone: '',
      adresse: '',
      statut: 'Actif',
    },
  );

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    onSubmit(form);

    setForm({
      nom: '',
      email: '',
      telephone: '',
      adresse: '',
      statut: 'Actif',
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block font-medium">Nom</label>

        <input
          type="text"
          name="nom"
          value={form.nom}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-300 p-3 focus:border-emerald-600 focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">Email</label>

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-300 p-3 focus:border-emerald-600 focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">Téléphone</label>

        <input
          type="text"
          name="telephone"
          value={form.telephone}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-300 p-3 focus:border-emerald-600 focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">Adresse</label>

        <input
          type="text"
          name="adresse"
          value={form.adresse}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-300 p-3 focus:border-emerald-600 focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">Statut</label>

        <select
          name="statut"
          value={form.statut}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-300 p-3 focus:border-emerald-600 focus:outline-none"
        >
          <option value="Actif">Actif</option>
          <option value="Inactif">Inactif</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-gray-300 px-6 py-3 hover:bg-gray-100"
        >
          Annuler
        </button>

        <Button type="submit">Enregistrer</Button>
      </div>
    </form>
  );
}
