import {
  Eye,
  Pencil,
  Trash2,
  FileDown,
  Receipt,
  FileText,
  Plus,
  Printer,
} from "lucide-react";
import Modal from "../../components/ui/Modal";
import ProformaForm from "../../components/proformas/ProformaForm";
import type { Proforma } from "../../types/proforma";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useProformaStore } from "../../store/proformaStore";
import { generateProformaPdf } from "../../utils/pdf/proformaPdf";
import { useFactureStore } from "../../store/factureStore";
import ProformaPreview from "../../components/proformas/ProformaPreview";
import { useNumeroStore } from "../../store/numeroStore";
import { generateNumber } from "../../utils/numberGenerator";

export default function Proformas() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const [editingProforma, setEditingProforma] = useState<Proforma | null>(null);

  const [deleteDialog, setDeleteDialog] = useState(false);

  const [proformaToDelete, setProformaToDelete] = useState<number | null>(null);

  const [previewOpen, setPreviewOpen] = useState(false);

  const [previewProforma, setPreviewProforma] = useState<Proforma | null>(null);

  const addProforma = useProformaStore((state) => state.addProforma);

  const addFacture = useFactureStore((state) => state.addFacture);

  const updateProforma = useProformaStore((state) => state.updateProforma);

  const deleteProforma = useProformaStore((state) => state.deleteProforma);

  const proformas = useProformaStore((state) => state.proformas);

  const getNextFacture = useNumeroStore((state) => state.getNextFacture);

  useEffect(() => {

  const previewId = location.state?.previewId;

  if (!previewId) return;

  const proforma = proformas.find(
    (p) => p.id === previewId
  );

  if (proforma) {

    setPreviewProforma(proforma);

    setPreviewOpen(true);

  }

}, [location.state, proformas]);

  const totalProformas = proformas.length;

  const montantTotal = proformas.reduce(
    (total, proforma) => total + proforma.montantTTC,
    0,
  );

  function handleAddProforma(proforma: Proforma) {
    addProforma(proforma);

    setIsOpen(false);
  }

  function handleUpdateProforma(proforma: Proforma) {
    updateProforma(proforma);

    setEditingProforma(null);

    setIsOpen(false);
  }

  function handleDeleteProforma() {
    if (proformaToDelete === null) return;

    deleteProforma(proformaToDelete);

    setDeleteDialog(false);

    setProformaToDelete(null);
  }

  function handleConvertToFacture(proforma: Proforma) {
    addFacture({
      id: Date.now(),

      numero: generateNumber("FAC", getNextFacture()),

      client: proforma.client,

      items: proforma.items,

      dateEmission: new Date().toLocaleDateString("fr-FR"),

      dateEcheance: proforma.dateValidite,

      montantHT: proforma.montantHT,

      tva: proforma.tva,

      montantTTC: proforma.montantTTC,

      statut: "Brouillon",

      notes: `Créée depuis la proforma ${proforma.numero}`,
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Proformas</h1>

          <p className="text-slate-500">
            Gérez vos devis et propositions commerciales.
          </p>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="
            flex items-center gap-2
            rounded-xl
            bg-emerald-600
            px-5 py-3
            text-white
            hover:bg-emerald-700
          "
        >
          <Plus size={18} />
          Nouvelle proforma
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-6">
          <div className="flex items-center gap-3">
            <FileText className="text-emerald-600" />

            <span>Nombre de proformas</span>
          </div>

          <p className="mt-4 text-3xl font-bold">{totalProformas}</p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-slate-500">Montant total</p>

          <p className="mt-4 text-3xl font-bold">
            {montantTotal.toLocaleString()} FCFA
          </p>
        </div>
      </div>

      {/* Tableau */}

      <div className="overflow-hidden rounded-xl border">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Numéro</th>

              <th>Client</th>

              <th>Montant TTC</th>

              <th>Statut</th>

              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {proformas.map((proforma) => (
              <tr key={proforma.id} className="border-t">
                <td className="p-3 font-medium">{proforma.numero}</td>

                <td>{proforma.client}</td>

                <td>{proforma.montantTTC.toLocaleString()} FCFA</td>

                <td>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      proforma.statut === "Acceptée"
                        ? "bg-green-100 text-green-700"
                        : proforma.statut === "Envoyée"
                          ? "bg-blue-100 text-blue-700"
                          : proforma.statut === "Refusée"
                            ? "bg-red-100 text-red-700"
                            : proforma.statut === "Expirée"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {proforma.statut}
                  </span>
                </td>

                <td>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        setPreviewProforma(proforma);
                        setPreviewOpen(true);
                      }}
                      className="rounded-lg bg-slate-100 p-2 hover:bg-slate-200"
                      title="Aperçu"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() => {
                        setEditingProforma(proforma);
                        setIsOpen(true);
                      }}
                      className="rounded-lg bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
                      title="Modifier"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => {
                        setProformaToDelete(proforma.id);
                        setDeleteDialog(true);
                      }}
                      className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>

                    <button
                      onClick={() => generateProformaPdf(proforma)}
                      className="rounded-lg bg-emerald-100 p-2 text-emerald-600 hover:bg-emerald-200"
                      title="Télécharger le PDF"
                    >
                      <FileDown size={18} />
                    </button>

                    <button
                      onClick={() => generateProformaPdf(proforma, "print")}
                      className="rounded-lg bg-indigo-100 p-2 text-indigo-600 hover:bg-indigo-200"
                      title="Imprimer"
                    >
                      <Printer size={18} />
                    </button>

                    <button
                      onClick={() => handleConvertToFacture(proforma)}
                      className="rounded-lg bg-violet-100 p-2 text-violet-600 hover:bg-violet-200"
                      title="Transformer en facture"
                    >
                      <Receipt size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isOpen}
        title="Nouvelle proforma"
        onClose={() => setIsOpen(false)}
      >
        <ProformaForm
          initialData={editingProforma ?? undefined}
          onSubmit={editingProforma ? handleUpdateProforma : handleAddProforma}
          onCancel={() => {
            setEditingProforma(null);
            setIsOpen(false);
          }}
        />
      </Modal>
      <ConfirmDialog
        isOpen={deleteDialog}
        title="Supprimer la proforma"
        message="Voulez-vous vraiment supprimer cette proforma ?"
        onCancel={() => {
          setDeleteDialog(false);
          setProformaToDelete(null);
        }}
        onConfirm={handleDeleteProforma}
      />
      <Modal
        isOpen={previewOpen}
        title="Aperçu de la proforma"
        onClose={() => setPreviewOpen(false)}
      >
        {previewProforma && <ProformaPreview proforma={previewProforma} />}
      </Modal>
    </div>
  );
}
