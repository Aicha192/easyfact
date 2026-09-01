import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import Sheet from '../../components/ui/Sheet';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ProduitStats from '../../components/produits/ProduitStats';
import ProduitForm from '../../components/produits/ProduitForm';
import ProduitTable from '../../components/produits/ProduitTable';
import ProduitSearch from '../../components/produits/ProduitSearch';
import type { ProduitFormData } from '../../components/produits/ProduitForm';
import { useNotificationStore } from '../../store/notificationStore';
import { useProduitStore } from '../../store/produitStore';
import type { Produit } from '../../types/produit';
import toast from 'react-hot-toast';

export default function Produits() {
  const produitList = useProduitStore((state) => state.produits);

  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  const setProduits = useProduitStore((state) => state.setProduits);

useEffect(() => {
  api
    .get<Produit[]>('/produits')
    .then((response) => {
      console.log('Produits récupérés depuis NestJS:', response.data);
      setProduits(response.data);
    })
    .catch((error) => {
      console.error(
        'Erreur lors de la récupération des produits:',
        error,
      );
    });
}, [setProduits]);

  const addProduit = useProduitStore((state) => state.addProduit);

  const updateProduit = useProduitStore((state) => state.updateProduit);

  const deleteProduit = useProduitStore((state) => state.deleteProduit);

  const [isOpen, setIsOpen] = useState(false);

  const [editingProduit, setEditingProduit] = useState<Produit | null>(null);

  const [deleteDialog, setDeleteDialog] = useState(false);

  const [produitToDelete, setProduitToDelete] = useState<number | null>(null);

  const [search, setSearch] = useState('');

  const filteredProduits = produitList.filter(
    (produit) =>
      produit.nom.toLowerCase().includes(search.toLowerCase()) ||
      produit.reference.toLowerCase().includes(search.toLowerCase()),
  );

 async function handleAddProduit(data: ProduitFormData) {
  try {
    const response = await api.post('/produits', data);

    console.log('Produit créé depuis NestJS:', response.data);

    const newProduit: Produit = response.data.produit;

    addProduit(newProduit);

    addNotification({
      title: 'Nouveau produit ajouté',
      message: `${newProduit.nom} a été ajouté au catalogue.`,
      createdAt: Date.now(),
      type: 'produit',
    });

    setIsOpen(false);

    toast.success('Produit ajouté avec succès !');
  } catch (error) {
    console.error(
      'Erreur lors de la création du produit:',
      error,
    );

    toast.error('Impossible de créer le produit.');
  }
}

  async function handleUpdateProduit(data: ProduitFormData) {
  if (!editingProduit) return;

  const updatedProduit = {
    ...editingProduit,
    ...data,
  };

  try {
    const response = await api.put(
  `/produits/${updatedProduit.id}`,
  updatedProduit,
);

    console.log('Produit modifié depuis NestJS:', response.data);

    const produitModifie: Produit = response.data.produit;

    updateProduit(produitModifie);

    addNotification({
      title: 'Produit modifié',
      message: `${produitModifie.nom} a été modifié.`,
      createdAt: Date.now(),
      type: 'produit',
    });

    setEditingProduit(null);
    setIsOpen(false);

    toast.success('Produit modifié avec succès !');
  } catch (error) {
    console.error(
      'Erreur lors de la modification du produit:',
      error,
    );

    toast.error('Impossible de modifier le produit.');
  }
}
  async function handleDeleteProduit() {
  if (produitToDelete === null) return;

  const deletedProduit = produitList.find(
    (produit) => produit.id === produitToDelete,
  );

  try {
    const response = await api.delete(`/produits/${produitToDelete}`);

    console.log('Produit supprimé depuis NestJS:', response.data);

    deleteProduit(produitToDelete);

    addNotification({
      title: 'Produit supprimé',
      message: `${deletedProduit?.nom ?? 'Le produit'} a été supprimé.`,
      createdAt: Date.now(),
      type: 'produit',
    });

    setDeleteDialog(false);
    setProduitToDelete(null);

    toast.success('Produit supprimé avec succès !');
  } catch (error) {
    console.error(
      'Erreur lors de la suppression du produit:',
      error,
    );

    toast.error('Impossible de supprimer le produit.');
  }
}

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Produits & Services</h1>

          <p className="text-slate-500">
            Gérez votre catalogue de produits et services.
          </p>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="rounded-xl bg-emerald-600 px-5 py-3 text-white hover:bg-emerald-700"
        >
          + Nouveau produit
        </button>
      </div>

      <ProduitStats produits={produitList} />

      <ProduitSearch value={search} onChange={setSearch} />

      <ProduitTable
        produits={filteredProduits}
        onEdit={(produit) => {
          setEditingProduit(produit);

          setIsOpen(true);
        }}
        onDelete={(produit) => {
          setProduitToDelete(produit.id);

          setDeleteDialog(true);
        }}
      />

      <Sheet
        isOpen={isOpen}
        title={editingProduit ? 'Modifier le produit' : 'Nouveau produit'}
        size="md"
        onClose={() => {
          setEditingProduit(null);
          setIsOpen(false);
        }}
      >
        <ProduitForm
          initialData={editingProduit ?? undefined}
          onSubmit={editingProduit ? handleUpdateProduit : handleAddProduit}
          onCancel={() => {
            setEditingProduit(null);

            setIsOpen(false);
          }}
        />
      </Sheet>

      <ConfirmDialog
        isOpen={deleteDialog}
        title="Supprimer le produit"
        message="Voulez-vous vraiment supprimer ce produit ?"
        onCancel={() => {
          setDeleteDialog(false);

          setProduitToDelete(null);
        }}
        onConfirm={handleDeleteProduit}
      />
    </div>
  );
}
