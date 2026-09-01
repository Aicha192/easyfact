import { useState } from 'react';

import type { Proforma } from '../../types/proforma';
import type { FactureItem } from '../../types/factureItem';
import FactureItems from '../factures/FactureItems';

interface Props {
  initialData?: Proforma;

  onSubmit: (proforma: Proforma) => void;

  onCancel: () => void;
}

export default function ProformaForm({
  initialData,
  onSubmit,
  onCancel,
}: Props) {
  const [form, setForm] = useState({
    numero: initialData?.numero ?? `PRO-${Date.now()}`,

    client: initialData?.client ?? '',

    dateEmission:
  initialData?.dateEmission ??
  new Date().toISOString().split('T')[0],

   dateValidite:
  initialData?.dateValidite ??
  new Date().toISOString().split('T')[0],

    tva: initialData?.tva ?? 18,

    statut: initialData?.statut ?? 'Brouillon',

    notes: initialData?.notes ?? '',
  });

  const [items, setItems] = useState<FactureItem[]>(initialData?.items ?? []);
  function handleAddItem() {
    setItems([
      ...items,
      {
        id: Date.now(),
        designation: '',
        quantite: 1,
        prixUnitaire: 0,
        total: 0,
      },
    ]);
  }

  function handleDeleteItem(id: number) {
    setItems(items.filter((item) => item.id !== id));
  }

  function handleItemChange(
    id: number,
    field: keyof FactureItem,
    value: string | number,
  ) {
    setItems(
      items.map((item) => {
        if (item.id !== id) return item;

        const updated = {
          ...item,
          [field]: value,
        };

        updated.total = updated.quantite * updated.prixUnitaire;

        return updated;
      }),
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const montantHT = items.reduce((total, item) => total + item.total, 0);

    const montantTTC = montantHT + (montantHT * form.tva) / 100;

    onSubmit({
      id: initialData?.id ?? Date.now(),

      numero: form.numero,

      client: form.client,

      items,

      dateEmission: form.dateEmission,

      dateValidite: form.dateValidite,

      montantHT,

      tva: form.tva,

      montantTTC,

      statut: form.statut,

      notes: form.notes,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-w-0 flex-col gap-5">
      <input
        className="w-full rounded-lg border p-3"
        placeholder="Client"
        value={form.client}
        onChange={(e) =>
          setForm({
            ...form,
            client: e.target.value,
          })
        }
      />

      <input
        type="date"
        className="w-full rounded-lg border p-3"
        value={form.dateValidite}
        onChange={(e) =>
          setForm({
            ...form,
            dateValidite: e.target.value,
          })
        }
      />

      <FactureItems
        items={items}
        onAdd={handleAddItem}
        onDelete={handleDeleteItem}
        onChange={handleItemChange}
      />

      <textarea
        className="w-full rounded-lg border p-3"
        placeholder="Notes"
        value={form.notes}
        onChange={(e) =>
          setForm({
            ...form,
            notes: e.target.value,
          })
        }
      />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-lg border px-4 py-2 sm:w-auto"
        >
          Annuler
        </button>

        <button
          type="submit"
          className="
    w-full
    rounded-lg
    bg-emerald-600
    px-4
    py-2
    text-white
    sm:w-auto
  "
        >
          Enregistrer
        </button>
      </div>
    </form>
  );
}
