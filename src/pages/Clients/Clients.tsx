import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

import ClientForm, {
  type ClientFormData,
} from '../../components/clients/ClientForm';
import ClientSearch from '../../components/clients/ClientSearch';
import ClientTable from '../../components/clients/ClientTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Sheet from '../../components/ui/Sheet';

import { useClientStore } from '../../store/clientStore';
import { useNotificationStore } from '../../store/notificationStore';

import type { Client } from '../../types/client';

import api from '../../lib/axios';

export default function Clients() {
  const clients = useClientStore((state) => state.clients);
  const setClients = useClientStore((state) => state.setClients);
  const addClient = useClientStore((state) => state.addClient);
  const updateClient = useClientStore((state) => state.updateClient);
  const deleteClient = useClientStore((state) => state.deleteClient);

  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  const [isOpen, setIsOpen] = useState(false);

  const [editingClient, setEditingClient] = useState<
    (ClientFormData & { id: number }) | null
  >(null);

  const [deleteDialog, setDeleteDialog] = useState(false);

  const [clientToDelete, setClientToDelete] = useState<number | null>(null);

  const [search, setSearch] = useState('');

  // Récupération des clients depuis NestJS
  useEffect(() => {
    api
      .get<Client[]>('/clients')
      .then((response) => {
        console.log(
          'Clients récupérés depuis NestJS:',
          response.data,
        );

        setClients(response.data);
      })
      .catch((error) => {
        console.error(
          'Erreur lors de la récupération des clients:',
          error,
        );

        toast.error('Impossible de récupérer les clients.');
      });
  }, [setClients]);

  // Création
  async function handleAddClient(data: ClientFormData) {
    try {
      const response = await api.post('/clients', data);

      console.log(
        'Client créé depuis NestJS:',
        response.data,
      );

      const newClient: Client = response.data.client;

      addClient(newClient);

      addNotification({
        title: 'Nouveau client ajouté',
        message: `${newClient.nom} a été ajouté aux clients.`,
        createdAt: Date.now(),
        type: 'client',
      });

      setIsOpen(false);

      toast.success('Client ajouté avec succès !');
    } catch (error) {
      console.error(
        'Erreur lors de la création du client:',
        error,
      );

      toast.error('Impossible de créer le client.');
    }
  }

  // Modification
  async function handleUpdateClient(data: ClientFormData) {
    if (!editingClient) return;

    try {
      const response = await api.put(
        `/clients/${editingClient.id}`,
        data,
      );

      console.log(
        'Client modifié depuis NestJS:',
        response.data,
      );

      const updatedClient: Client = response.data.client;

      updateClient(updatedClient);

      addNotification({
        title: 'Client modifié',
        message: `${updatedClient.nom} a été modifié.`,
        createdAt: Date.now(),
        type: 'client',
      });

      setEditingClient(null);
      setIsOpen(false);

      toast.success('Client modifié avec succès !');
    } catch (error) {
      console.error(
        'Erreur lors de la modification du client:',
        error,
      );

      toast.error('Impossible de modifier le client.');
    }
  }

  // Suppression
  async function handleDeleteClient() {
    if (clientToDelete === null) return;

    const client = clients.find(
      (client) => client.id === clientToDelete,
    );

    try {
      const response = await api.delete(
        `/clients/${clientToDelete}`,
      );

      console.log(
        'Client supprimé depuis NestJS:',
        response.data,
      );

      deleteClient(clientToDelete);

      addNotification({
        title: 'Client supprimé',
        message: `${client?.nom ?? 'Le client'} a été supprimé.`,
        createdAt: Date.now(),
        type: 'client',
      });

      setDeleteDialog(false);
      setClientToDelete(null);

      toast.success('Client supprimé avec succès !');
    } catch (error) {
      console.error(
        'Erreur lors de la suppression du client:',
        error,
      );

      toast.error('Impossible de supprimer le client.');
    }
  }

  // Recherche
  const filteredClients = clients.filter(
    (client) =>
      client.nom
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      client.email
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      client.telephone.includes(search),
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>

          <p className="text-gray-500">
            Gérez votre portefeuille clients.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingClient(null);
            setIsOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-white hover:bg-emerald-700"
        >
          <Plus size={20} />

          Nouveau client
        </button>
      </div>

      {/* Recherche */}
      <ClientSearch
        value={search}
        onChange={setSearch}
      />

      {/* Tableau */}
      <ClientTable
        clients={filteredClients}
        onEdit={(client) => {
          setEditingClient(client);
          setIsOpen(true);
        }}
        onDelete={(client) => {
          setClientToDelete(client.id);
          setDeleteDialog(true);
        }}
      />

      {/* Formulaire */}
      <Sheet
        isOpen={isOpen}
        title={
          editingClient
            ? 'Modifier le client'
            : 'Nouveau client'
        }
        size="md"
        onClose={() => {
          setEditingClient(null);
          setIsOpen(false);
        }}
      >
        <ClientForm
          initialData={editingClient ?? undefined}
          onSubmit={
            editingClient
              ? handleUpdateClient
              : handleAddClient
          }
          onCancel={() => {
            setEditingClient(null);
            setIsOpen(false);
          }}
        />
      </Sheet>

      {/* Confirmation suppression */}
      <ConfirmDialog
        isOpen={deleteDialog}
        title="Supprimer le client"
        message="Voulez-vous vraiment supprimer ce client ?"
        onCancel={() => {
          setDeleteDialog(false);
          setClientToDelete(null);
        }}
        onConfirm={handleDeleteClient}
      />
    </div>
  );
}