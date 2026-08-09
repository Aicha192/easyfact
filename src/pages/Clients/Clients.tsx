import { useState } from "react";
import toast from "react-hot-toast";
// import Modal from "../../components/ui/Modal";
import ClientForm, {
  type ClientFormData,
} from "../../components/clients/ClientForm";
import { Plus } from "lucide-react";
import ClientSearch from "../../components/clients/ClientSearch";
import ClientTable from "../../components/clients/ClientTable";
import { useClientStore } from "../../store/clientStore";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import type { Client } from "../../types/client";
import { useNotificationStore } from "../../store/notificationStore";
import Sheet from "../../components/ui/Sheet";

export default function Clients() {
  const [isOpen, setIsOpen] = useState(false);

  const clientList = useClientStore((state) => state.clients);

  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  const addClient = useClientStore((state) => state.addClient);

  const updateClient = useClientStore((state) => state.updateClient);

  const deleteClient = useClientStore((state) => state.deleteClient);

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

    addNotification({
      title: "Nouveau client ajouté",

      message: `${newClient.nom} a été ajouté aux clients.`,

     createdAt: Date.now(),

      type: "client",
    });

    setIsOpen(false);

    toast.success("Client ajouté avec succès !");
  }

  function handleUpdateClient(data: ClientFormData) {
    if (!editingClient) return;

    const updatedClient = {
      ...editingClient,
      ...data,
    };

    updateClient(updatedClient);

    addNotification({
      title: "Client modifié",

      message: `${updatedClient.nom} a été modifié.`,

      createdAt: Date.now(),

      type: "client",
    });

    setEditingClient(null);

    setIsOpen(false);

    toast.success("Client modifié avec succès !");
  }

  function handleDeleteClient() {
    if (clientToDelete === null) return;

    const client = clientList.find((client) => client.id === clientToDelete);

    deleteClient(clientToDelete);

    addNotification({
      title: "Client supprimé",

      message: `${client?.nom ?? "Le client"} a été supprimé.`,

      createdAt: Date.now(),

      type: "client",
    });

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
      <Sheet
        isOpen={isOpen}
        title={editingClient ? "Modifier le client" : "Nouveau client"}
        size="md"
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
      </Sheet>

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
