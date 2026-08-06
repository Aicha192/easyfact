import { useMemo, useState } from "react";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import { clients } from "../../data/clients";
import type { FactureItem } from "../../types/factureItem";
import FactureItems from "./FactureItems";
import { produits } from "../../data/produits";
import { useNumeroStore } from "../../store/numeroStore";
import { generateNumber } from "../../utils/numberGenerator";
import type { Facture } from "../../types/facture";
import type { FactureFormData } from "./FactureForm.types";
import Input from "../ui/Input";
import Button from "../ui/Button";

interface Props {
  initialData?: FactureFormData;
  onSubmit: (facture: Facture) => void;
  onCancel: () => void;
}

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

export default function FactureForm({
  initialData,
  onSubmit,
  onCancel,
}: Props) {
  const today = formatDate(new Date());

  const nextMonth = formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));

  const nextFacture = useNumeroStore((state) => state.getNextFacture());

  const incrementFacture = useNumeroStore(
  (state) => state.incrementFacture
);

  const [items, setItems] = useState<FactureItem[]>([]);

  const [form, setForm] = useState<FactureFormData>(
    initialData ?? {
      id: undefined,
      client: "",
      numero: generateNumber("FAC", nextFacture),
      dateEmission: today,
      dateEcheance: nextMonth,
      montantHT: 0,
      tva: 18,
      statut: "Brouillon",
      notes: "",
    },
  );

  // Calcul automatique du TTC
  const sousTotalHT = useMemo(() => {
    return items.reduce((total, item) => total + item.total, 0);
  }, [items]);

  const montantTTC = useMemo(() => {
    return sousTotalHT + (sousTotalHT * form.tva) / 100;
  }, [sousTotalHT, form.tva]);
  const selectedClient = clients.find((client) => client.nom === form.client);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "montantHT" || name === "tva" ? Number(value) : value,
    }));
  }

  function handleItemChange(
    id: number,
    field: keyof FactureItem,
    value: string | number,
  ) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        let updated = {
          ...item,
          [field]: value,
        };

        if (field === "designation") {
          const produit = produits.find((p) => p.nom === value);

          if (produit) {
            updated = {
              ...updated,
              prixUnitaire: produit.prix,
            };
          }
        }

        return {
          ...updated,
          total: updated.quantite * updated.prixUnitaire,
        };
      }),
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!initialData) {
  incrementFacture();
}

    onSubmit({
      id: form.id ?? Date.now(),

      numero: form.numero,

      client: form.client,

      items,

      dateEmission: form.dateEmission,

      dateEcheance: form.dateEcheance,

      montantHT: sousTotalHT,

      tva: form.tva,

      montantTTC,

      statut: form.statut,

      notes: form.notes,
    });
  }

  function handleAddItem() {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        designation: "Nouveau produit",
        quantite: 1,
        prixUnitaire: 0,
        total: 0,
      },
    ]);
  }

  function handleDeleteItem(id: number) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="border-b pb-2 text-lg font-semibold text-slate-800">
        Informations générales
      </h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Select
          label="Client"
          name="client"
          value={form.client}
          onChange={handleChange}
        >
          <option value="">Sélectionner un client</option>

          {clients.map((client) => (
            <option key={client.id} value={client.nom}>
              {client.nom}
            </option>
          ))}
        </Select>
        {selectedClient && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h4 className="mb-3 font-semibold text-slate-700">
              Informations du client
            </h4>

            <div className="space-y-2 text-sm text-slate-600">
              <p>
                <strong>Email :</strong> {selectedClient.email}
              </p>

              <p>
                <strong>Téléphone :</strong> {selectedClient.telephone}
              </p>

              <p>
                <strong>Adresse :</strong> {selectedClient.adresse}
              </p>
            </div>
          </div>
        )}

        <Input label="Numéro" name="numero" value={form.numero} readOnly />

        <Input
          label="Date d'émission"
          type="date"
          name="dateEmission"
          value={form.dateEmission}
          onChange={handleChange}
        />

        <Input
          label="Date d'échéance"
          type="date"
          name="dateEcheance"
          value={form.dateEcheance}
          onChange={handleChange}
        />
      </div>

      <h3 className="border-b pt-4 pb-2 text-lg font-semibold text-slate-800">
        Informations financières
      </h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Sous-total HT"
          value={sousTotalHT}
          readOnly
          className="bg-slate-100"
        />

        <Input
          label="TVA (%)"
          name="tva"
          type="number"
          value={form.tva}
          onChange={handleChange}
        />

        <Input
          label="Montant TTC"
          value={montantTTC}
          readOnly
          className="bg-slate-100"
        />

        <Select
          label="Statut"
          name="statut"
          value={form.statut}
          onChange={handleChange}
        >
          <option value="Brouillon">Brouillon</option>
          <option value="Envoyée">Envoyée</option>
          <option value="Payée">Payée</option>
          <option value="En retard">En retard</option>
        </Select>
      </div>

      <h3 className="border-b pt-4 pb-2 text-lg font-semibold text-slate-800">
        Informations complémentaires
      </h3>

      <Textarea
        label="Notes"
        name="notes"
        value={form.notes}
        onChange={handleChange}
        placeholder="Ajouter une remarque..."
      />

      <FactureItems
        items={items}
        onAdd={handleAddItem}
        onDelete={handleDeleteItem}
        onChange={handleItemChange}
      />

      <div className="mt-6 ml-auto w-full max-w-sm rounded-xl border bg-slate-50 p-4">
        <div className="flex justify-between py-2">
          <span>Sous-total HT</span>
          <strong>{sousTotalHT.toLocaleString()} FCFA</strong>
        </div>

        <div className="flex justify-between py-2">
          <span>TVA ({form.tva}%)</span>
          <strong>
            {((sousTotalHT * form.tva) / 100).toLocaleString()} FCFA
          </strong>
        </div>

        <hr className="my-3" />

        <div className="flex justify-between text-lg font-bold text-emerald-600">
          <span>Total TTC</span>
          <span>{montantTTC.toLocaleString()} FCFA</span>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3 border-t pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-300 px-5 py-2 hover:bg-slate-100"
        >
          Annuler
        </button>

        <Button type="submit">{initialData ? "Enregistrer" : "Créer"}</Button>
      </div>
    </form>
  );
}
