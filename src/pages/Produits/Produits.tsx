import { useState } from "react";

import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import ProduitStats from "../../components/produits/ProduitStats";
import ProduitForm from "../../components/produits/ProduitForm";
import ProduitTable from "../../components/produits/ProduitTable";
import ProduitSearch from "../../components/produits/ProduitSearch";
import type { ProduitFormData } from "../../components/produits/ProduitForm";

import { useProduitStore } from "../../store/produitStore";

import type { Produit } from "../../types/produit";

import toast from "react-hot-toast";

export default function Produits() {
  const produitList = useProduitStore(
  (state) => state.produits
);

const addProduit = useProduitStore(
  (state) => state.addProduit
);

const updateProduit = useProduitStore(
  (state) => state.updateProduit
);

const deleteProduit = useProduitStore(
  (state) => state.deleteProduit
);

  const [isOpen, setIsOpen] = useState(false);

  const [editingProduit, setEditingProduit] = useState<Produit | null>(null);

  const [deleteDialog, setDeleteDialog] = useState(false);

  const [produitToDelete, setProduitToDelete] = useState<number | null>(null);

  const [search, setSearch] = useState("");

  const filteredProduits = produitList.filter(
    (produit) =>
      produit.nom.toLowerCase().includes(search.toLowerCase()) ||
      produit.reference.toLowerCase().includes(search.toLowerCase()),
  );

  function handleAddProduit(data: ProduitFormData) {
  const newProduit: Produit = {
    id: Date.now(),
    ...data,
  };

  addProduit(newProduit);

  setIsOpen(false);

  toast.success("Produit ajouté avec succès !");
}

  function handleUpdateProduit(data: ProduitFormData) {
  if (!editingProduit) return;

  updateProduit({
    ...editingProduit,
    ...data,
  });

  setEditingProduit(null);

  setIsOpen(false);

  toast.success("Produit modifié avec succès !");
}

  function handleDeleteProduit() {
  if (produitToDelete === null) return;

  deleteProduit(produitToDelete);

  setDeleteDialog(false);
  setProduitToDelete(null);

  toast.success("Produit supprimé avec succès !");
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

      <Modal
        isOpen={isOpen}
        title={editingProduit ? "Modifier le produit" : "Nouveau produit"}
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
      </Modal>

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
