import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import Modal from '../../components/ui/Modal';
import Sheet from '../../components/ui/Sheet';
import FactureForm from '../../components/factures/FactureForm';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import FactureStats from '../../components/factures/FactureStats';
import FactureTable from '../../components/factures/FactureTable';
import FactureSearch from '../../components/factures/FactureSearch';
import FacturePreview from '../../components/factures/FacturePreview';

import { generateInvoicePdf } from '../../utils/pdf/invoicePdf';
import { useFactures } from '../../hooks/useFactures';

export default function Factures() {
  const location = useLocation();

  const {
    factures,
    filteredFactures,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    setFactureToDelete,

    editingFacture,
    setEditingFacture,

    previewFacture,
    setPreviewFacture,

    handleAddFacture,
    handleUpdateFacture,
    handleDeleteFacture,
    handleStatusChange,
  } = useFactures();

  const [isOpen, setIsOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(
    Boolean(location.state?.previewId),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
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
        {['Toutes', 'Brouillon', 'Envoyée', 'Payée', 'En retard'].map(
          (status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                statusFilter === status
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
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
        onPdf={async (facture) => {
          await generateInvoicePdf(facture);
        }}
        onPrint={async (facture) => {
          await generateInvoicePdf(facture, 'print');
        }}
        onStatusChange={handleStatusChange}
      />

      <Sheet
        isOpen={isOpen}
        title={editingFacture ? 'Modifier la facture' : 'Nouvelle facture'}
        size="lg"
        onClose={() => {
          setEditingFacture(null);
          setIsOpen(false);
        }}
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
                  tva: 18,
                  statut: editingFacture.statut,
                  notes: editingFacture.notes ?? '',
                  items: editingFacture.items,
                }
              : undefined
          }
          onSubmit={
            editingFacture
              ? async (facture) => {
                  await handleUpdateFacture(facture);
                  setEditingFacture(null);
                  setIsOpen(false);
                }
              : async (facture) => {
                  await handleAddFacture(facture);
                  setIsOpen(false);
                }
          }
          onCancel={() => {
            setEditingFacture(null);
            setIsOpen(false);
          }}
        />
      </Sheet>

      <Modal
        isOpen={previewOpen}
        title="Aperçu de la facture"
        onClose={() => {
          setPreviewOpen(false);
          setPreviewFacture(null);
        }}
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
        onConfirm={() => {
          handleDeleteFacture();
          setDeleteDialog(false);
        }}
      />
    </div>
  );
}
