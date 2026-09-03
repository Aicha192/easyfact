import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Produit } from '../../types/produit';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Input from '../ui/Input';
import Button from '../ui/Button';
import type { Client } from '../../types/client';
import api from '../../lib/axios';
import type { FactureItem } from '../../types/factureItem';
import type { Facture } from '../../types/facture';
import type { FactureFormData } from './FactureForm.types';
import FactureItems from './FactureItems';
import { useNumeroStore } from '../../store/numeroStore';
import { generateNumber } from '../../utils/numberGenerator';

import {
  factureSchema,
  type FactureFormSchema,
} from '../../schemas/factureSchema';

interface Props {
  initialData?: FactureFormData;
  onSubmit: (facture: Facture) => void;
  onCancel: () => void;
}

function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

export default function FactureForm({
  initialData,
  onSubmit,
  onCancel,
}: Props) {
  const today = formatDate(new Date());

  const nextMonth = formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));

  const nextFacture = useNumeroStore((state) => state.getNextFacture());

  const incrementFacture = useNumeroStore((state) => state.incrementFacture);

  const [items, setItems] = useState<FactureItem[]>([]);

const [clients, setClients] = useState<Client[]>([]);
const [produits, setProduits] = useState<Produit[]>([]);

useEffect(() => {
  Promise.all([
    api.get<Client[]>('/clients'),
    api.get<Produit[]>('/produits'),
  ])
    .then(([clientsResponse, produitsResponse]) => {
      setClients(clientsResponse.data);
      setProduits(produitsResponse.data);
    })
    .catch((error) => {
      console.error(
        'Erreur lors de la récupération des clients et produits:',
        error,
      );
    });
}, []);

  const defaultValues: FactureFormSchema = {
    client: initialData?.client ?? '',
    numero: initialData?.numero ?? generateNumber('FAC', nextFacture),
    dateEmission: initialData?.dateEmission ?? today,
    dateEcheance: initialData?.dateEcheance ?? nextMonth,
    tva: initialData?.tva ?? 18,
    statut: initialData?.statut ?? 'Brouillon',
    notes: initialData?.notes ?? '',
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FactureFormSchema>({
    resolver: zodResolver(factureSchema),
    defaultValues,
  });

  useEffect(() => {
  if (initialData) {
    reset({
      client: initialData.client,
      numero: initialData.numero,
      dateEmission: initialData.dateEmission,
      dateEcheance: initialData.dateEcheance,
      tva: initialData.tva,
      statut: initialData.statut,
      notes: initialData.notes ?? '',
    });

    setItems(initialData.items ?? []);
  } else {
    reset({
      client: '',
      numero: generateNumber('FAC', nextFacture),
      dateEmission: today,
      dateEcheance: nextMonth,
      tva: 18,
      statut: 'Brouillon',
      notes: '',
    });

    setItems([]);
  }
}, [initialData, nextFacture, nextMonth, reset, today]);

  const clientValue = watch('client');
  const tvaValue = watch('tva');
  const statutValue = watch('statut');

  const selectedClient = clients.find((client) => client.nom === clientValue);

  const sousTotalHT = useMemo(() => {
    return items.reduce((total, item) => total + item.total, 0);
  }, [items]);

  const montantTTC = useMemo(() => {
    return sousTotalHT + (sousTotalHT * tvaValue) / 100;
  }, [sousTotalHT, tvaValue]);

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

        if (field === 'designation') {
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

  function handleFormSubmit(data: FactureFormSchema) {
    if (!initialData) {
      incrementFacture();
    }

    onSubmit({
      id: initialData?.id ?? Date.now(),

      numero: data.numero,

      client: data.client,

      items,

      dateEmission: data.dateEmission,

      dateEcheance: data.dateEcheance,

      montantHT: sousTotalHT,

      tva: data.tva,

      montantTTC,

      statut: data.statut,

      notes: data.notes,
    });
  }

  function handleAddItem() {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        designation: 'Nouveau produit',
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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <h3 className="border-b pb-2 text-lg font-semibold text-slate-800">
        Informations générales
      </h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Select
  label="Client"
  name="client"
  value={clientValue}
  defaultValue={clientValue}
  onChange={(e) =>
    setValue('client', e.target.value, {
      shouldValidate: true,
    })
  }
>
            <option value="">Sélectionner un client</option>

            {clients.map((client) => (
              <option key={client.id} value={client.nom}>
                {client.nom}
              </option>
            ))}
          </Select>

          {errors.client && (
            <p className="mt-1 text-sm text-red-500">{errors.client.message}</p>
          )}
        </div>

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

        <div>
          <Input label="Numéro" {...register('numero')} readOnly />

          {errors.numero && (
            <p className="mt-1 text-sm text-red-500">{errors.numero.message}</p>
          )}
        </div>

        <div>
          <Input
            label="Date d'émission"
            type="date"
            {...register('dateEmission')}
          />

          {errors.dateEmission && (
            <p className="mt-1 text-sm text-red-500">
              {errors.dateEmission.message}
            </p>
          )}
        </div>

        <div>
          <Input
            label="Date d'échéance"
            type="date"
            {...register('dateEcheance')}
          />

          {errors.dateEcheance && (
            <p className="mt-1 text-sm text-red-500">
              {errors.dateEcheance.message}
            </p>
          )}
        </div>
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

        <div>
          <Input
            label="TVA (%)"
            type="number"
            {...register('tva', { valueAsNumber: true })}
          />

          {errors.tva && (
            <p className="mt-1 text-sm text-red-500">{errors.tva.message}</p>
          )}
        </div>

        <Input
          label="Montant TTC"
          value={montantTTC}
          readOnly
          className="bg-slate-100"
        />

        <div>
          <Select
            label="Statut"
            name="statut"
            value={statutValue}
            onChange={(e) =>
              setValue(
                'statut',
                e.target.value as FactureFormSchema['statut'],
                {
                  shouldValidate: true,
                },
              )
            }
          >
            <option value="Brouillon">Brouillon</option>
            <option value="Envoyée">Envoyée</option>
            <option value="Payée">Payée</option>
            <option value="En retard">En retard</option>
          </Select>

          {errors.statut && (
            <p className="mt-1 text-sm text-red-500">{errors.statut.message}</p>
          )}
        </div>
      </div>

      <h3 className="border-b pt-4 pb-2 text-lg font-semibold text-slate-800">
        Informations complémentaires
      </h3>

      <Textarea
        label="Notes"
        {...register('notes')}
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
          <span>TVA ({tvaValue}%)</span>

          <strong>
            {((sousTotalHT * tvaValue) / 100).toLocaleString()} FCFA
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

        <Button type="submit">{initialData ? 'Enregistrer' : 'Créer'}</Button>
      </div>
    </form>
  );
}
