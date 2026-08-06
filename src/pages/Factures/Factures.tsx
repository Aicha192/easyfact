import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Modal from "../../components/ui/Modal";
import FactureForm from "../../components/factures/FactureForm";
import toast from "react-hot-toast";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import type { Facture } from "../../types/facture";
import { useFactureStore } from "../../store/factureStore";
import FactureStats from "../../components/factures/FactureStats";
import FactureTable from "../../components/factures/FactureTable";
import FactureSearch from "../../components/factures/FactureSearch";
import FacturePreview from "../../components/factures/FacturePreview";
import { generateInvoicePdf } from "../../utils/pdf/invoicePdf";

export default function Factures() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const [factureToDelete, setFactureToDelete] = useState<number | null>(null);
  const [editingFacture, setEditingFacture] = useState<Facture | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Toutes");
  const factures = useFactureStore((state) => state.factures);
  const addFacture = useFactureStore((state) => state.addFacture);

  const updateFacture = useFactureStore((state) => state.updateFacture);

  const deleteFacture = useFactureStore((state) => state.deleteFacture);

  const updateStatus = useFactureStore((state) => state.updateStatus);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [previewFacture, setPreviewFacture] = useState<Facture | null>(null);

  useEffect(() => {

  const previewId = location.state?.previewId;

  if (!previewId) return;

  const facture = factures.find(
    (f) => f.id === previewId
  );

  if (facture) {

    setPreviewFacture(facture);

    setPreviewOpen(true);

  }

}, [location.state, factures]);

  const filteredFactures = factures.filter((facture) => {
    const matchesSearch =
      facture.numero.toLowerCase().includes(search.toLowerCase()) ||
      facture.client.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "Toutes" || facture.statut === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function handleAddFacture(facture: Facture) {
    addFacture(facture);

    setIsOpen(false);

    toast.success("Facture créée avec succès !");
  }

  function handleUpdateFacture(updatedFacture: Facture) {
    updateFacture(updatedFacture);

    setEditingFacture(null);

    setIsOpen(false);

    toast.success("Facture modifiée avec succès !");
  }

  function handleDeleteFacture() {
    if (factureToDelete === null) return;

    deleteFacture(factureToDelete);
    setDeleteDialog(false);
    setFactureToDelete(null);
    toast.success("Facture supprimée avec succès !");
  }

  function handleStatusChange(id: number, statut: Facture["statut"]) {
    updateStatus(id, statut);

    toast.success("Statut mis à jour !");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Factures</h1>

          <p className="mt-2 text-slate-500">Gérez vos factures clients.</p>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="rounded-xl bg-emerald-600 px-5 py-3 text-white hover:bg-emerald-700"
        >
          + Nouvelle facture
        </button>
      </div>

      <FactureStats factures={factures} />

      <FactureSearch value={search} onChange={setSearch} />

      <div className="flex flex-wrap gap-3">
        {["Toutes", "Brouillon", "Envoyée", "Payée", "En retard"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                statusFilter === status
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              {status}
            </button>
          ),
        )}
      </div>

      <FactureTable
        factures={filteredFactures}
        onPreview={(facture) => {
          setPreviewFacture(facture);
          setPreviewOpen(true);
        }}
        onEdit={(facture) => {
          setEditingFacture(facture);
          setIsOpen(true);
        }}
        onDelete={(facture) => {
          setFactureToDelete(facture.id);
          setDeleteDialog(true);
        }}
        onPdf={(facture) => {
          generateInvoicePdf(facture);
        }}
        onPrint={(facture) => {
          generateInvoicePdf(facture, "print");
        }}
        onStatusChange={handleStatusChange}
      />
      <Modal
        isOpen={isOpen}
        title={editingFacture ? "Modifier la facture" : "Nouvelle facture"}
        onClose={() => setIsOpen(false)}
      >
        <FactureForm
          initialData={
            editingFacture
              ? {
                  id: editingFacture.id,
                  client: editingFacture.client,
                  numero: editingFacture.numero,
                  dateEmission: editingFacture.dateEmission,
                  dateEcheance: editingFacture.dateEcheance,
                  montantHT: editingFacture.montantHT,
                  tva: editingFacture.tva,
                  statut: editingFacture.statut,
                  notes: editingFacture.notes ?? "",
                }
              : undefined
          }
          onSubmit={editingFacture ? handleUpdateFacture : handleAddFacture}
          onCancel={() => {
            setEditingFacture(null);
            setIsOpen(false);
          }}
        />
      </Modal>
      <Modal
        isOpen={previewOpen}
        title="Aperçu de la facture"
        onClose={() => setPreviewOpen(false)}
      >
        {previewFacture && (
          <FacturePreview
            facture={previewFacture}
            items={previewFacture.items}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog}
        title="Supprimer la facture"
        message="Voulez-vous vraiment supprimer cette facture ?"
        onCancel={() => {
          setDeleteDialog(false);
          setFactureToDelete(null);
        }}
        onConfirm={handleDeleteFacture}
      />
    </div>
  );
}
