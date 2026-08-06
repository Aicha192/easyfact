import { useState } from "react";
import toast from "react-hot-toast";

import Modal from "../../components/ui/Modal";
import ClientForm, {
  type ClientFormData,
} from "../../components/clients/ClientForm";
import { Plus } from "lucide-react";
import ClientSearch from "../../components/clients/ClientSearch";
import ClientTable from "../../components/clients/ClientTable";
import { useClientStore } from "../../store/clientStore";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import type { Client } from "../../types/client";

export default function Clients() {
  const [isOpen, setIsOpen] = useState(false);

  const clientList = useClientStore(
  (state) => state.clients
);

const addClient = useClientStore(
  (state) => state.addClient
);

const updateClient = useClientStore(
  (state) => state.updateClient
);

const deleteClient = useClientStore(
  (state) => state.deleteClient
);

  const [editingClient, setEditingClient] = useState<
    (ClientFormData & { id: number }) | null
  >(null);

  const [deleteDialog, setDeleteDialog] = useState(false);

  const [clientToDelete, setClientToDelete] = useState<number | null>(null);

  const [search, setSearch] = useState("");

  function handleAddClient(data: ClientFormData) {
  const newClient: Client = {
    id: Date.now(),
    ...data,
  };

  addClient(newClient);

  setIsOpen(false);

  toast.success("Client ajouté avec succès !");
}

  function handleUpdateClient(data: ClientFormData) {
  if (!editingClient) return;

  updateClient({
    ...editingClient,
    ...data,
  });

  setEditingClient(null);
  setIsOpen(false);

  toast.success("Client modifié avec succès !");
}

  function handleDeleteClient() {
  if (clientToDelete === null) return;

  deleteClient(clientToDelete);

  setDeleteDialog(false);
  setClientToDelete(null);

  toast.success("Client supprimé avec succès !");
}

  const filteredClients = clientList.filter(
    (client) =>
      client.nom.toLowerCase().includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase()) ||
      client.telephone.includes(search),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>

          <p className="text-gray-500">Gérez votre portefeuille clients.</p>
        </div>

        <button
          onClick={() => {
            toast.success("EasyFact fonctionne !");
            setIsOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-white hover:bg-emerald-700"
        >
          <Plus size={20} />
          Nouveau client
        </button>
      </div>

      <ClientSearch value={search} onChange={setSearch} />

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
      <Modal
        isOpen={isOpen}
        title={editingClient ? "Modifier le client" : "Nouveau client"}
        onClose={() => {
          setEditingClient(null);
          setIsOpen(false);
        }}
      >
        <ClientForm
          initialData={editingClient ?? undefined}
          onSubmit={editingClient ? handleUpdateClient : handleAddClient}
          onCancel={() => {
            setEditingClient(null);
            setIsOpen(false);
          }}
        />
      </Modal>

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
