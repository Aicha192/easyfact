import {
  Eye,
  Pencil,
  Trash2,
  FileDown,
  Receipt,
  FileText,
  Plus,
  Printer,
} from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Sheet from '../../components/ui/Sheet';
import ProformaForm from '../../components/proformas/ProformaForm';
import type { Proforma } from '../../types/proforma';
import type { Facture } from '../../types/facture';
import { useState } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useProformaStore } from '../../store/proformaStore';
import { generateProformaPdf } from '../../utils/pdf/proformaPdf';
import { useFactureStore } from '../../store/factureStore';
import ProformaPreview from '../../components/proformas/ProformaPreview';
import { useNumeroStore } from '../../store/numeroStore';
import { generateNumber } from '../../utils/numberGenerator';
import { useNotificationStore } from '../../store/notificationStore';
import ProformaSearch from '../../components/proformas/ProformaSearch';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

export default function Proformas() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const [proformasBackend, setProformasBackend] = useState<Proforma[]>([]);

  const [editingProforma, setEditingProforma] = useState<Proforma | null>(null);

  const [proformaToConvert, setProformaToConvert] = useState<Proforma | null>(
    null,
  );

  const [deleteDialog, setDeleteDialog] = useState(false);

  const [proformaToDelete, setProformaToDelete] = useState<number | null>(null);

  const [previewOpen, setPreviewOpen] = useState(false);

  const [previewProforma, setPreviewProforma] = useState<Proforma | null>(null);

  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  const setProformas = useProformaStore((state) => state.setProformas);

  const addProforma = useProformaStore((state) => state.addProforma);

  const addFacture = useFactureStore((state) => state.addFacture);

  const updateProforma = useProformaStore((state) => state.updateProforma);

  const deleteProforma = useProformaStore((state) => state.deleteProforma);

  const proformas = proformasBackend;

  const filteredProformas = proformas.filter(
    (proforma) =>
      proforma.numero.toLowerCase().includes(search.toLowerCase()) ||
      proforma.client.toLowerCase().includes(search.toLowerCase()),
  );

  const getNextFacture = useNumeroStore((state) => state.getNextFacture);

  useEffect(() => {
    const previewId = location.state?.previewId;

    if (!previewId) return;

    const proforma = proformas.find((p) => p.id === previewId);

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

  useEffect(() => {
    api
      .get<Proforma[]>('http://localhost:3000/proformas')
      .then((response) => {
        console.log('Proformas récupérées depuis NestJS:', response.data);

        setProformasBackend(response.data);
        setProformas(response.data);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des proformas:', error);
      });
  }, []);

  async function handleAddProforma(proforma: Proforma) {
    try {
      const response = await api.post(
        'http://localhost:3000/proformas',
        proforma,
      );

      console.log('Proforma créée depuis NestJS:', response.data);

      const newProforma: Proforma = response.data.proforma;

      addProforma(newProforma);
      setProformasBackend((current) => [...current, newProforma]);

      addNotification({
        title: 'Nouvelle proforma créée',
        message: `La proforma ${newProforma.numero} a été créée.`,
        createdAt: Date.now(),
        type: 'proforma',
      });

      setIsOpen(false);

      toast.success('Proforma créée avec succès !');
    } catch (error) {
      console.error('Erreur lors de la création de la proforma:', error);

      toast.error('Impossible de créer la proforma.');
    }
  }

  async function handleUpdateProforma(proforma: Proforma) {
    try {
      const response = await api.put(
        `http://localhost:3000/proformas/${proforma.id}`,
        proforma,
      );

      console.log('Proforma modifiée depuis NestJS:', response.data);

      const proformaModifiee: Proforma = response.data.proforma;

      updateProforma(proformaModifiee);

      setProformasBackend((current) =>
        current.map((item) =>
          item.id === proformaModifiee.id ? proformaModifiee : item,
        ),
      );

      addNotification({
        title: 'Proforma modifiée',
        message: `La proforma ${proformaModifiee.numero} a été modifiée.`,
        createdAt: Date.now(),
        type: 'proforma',
      });

      setEditingProforma(null);
      setIsOpen(false);

      toast.success('Proforma modifiée avec succès !');
    } catch (error) {
      console.error('Erreur lors de la modification de la proforma:', error);

      toast.error('Impossible de modifier la proforma.');
    }
  }

  async function handleDeleteProforma() {
    if (proformaToDelete === null) return;
    console.log('ID proforma à supprimer =', proformaToDelete);

    const deletedProforma = proformas.find(
      (proforma) => proforma.id === proformaToDelete,
    );

    try {
      const response = await api.delete(
        `http://localhost:3000/proformas/${proformaToDelete}`,
      );

      console.log('Proforma supprimée depuis NestJS:', response.data);

      deleteProforma(proformaToDelete);

      setProformasBackend((current) =>
        current.filter((proforma) => proforma.id !== proformaToDelete),
      );

      addNotification({
        title: 'Proforma supprimée',
        message: `${deletedProforma?.numero ?? 'La proforma'} a été supprimée.`,
        createdAt: Date.now(),
        type: 'proforma',
      });

      setDeleteDialog(false);
      setProformaToDelete(null);

      toast.success('Proforma supprimée avec succès !');
    } catch (error) {
      console.error('Erreur lors de la suppression de la proforma:', error);

      toast.error('Impossible de supprimer la proforma.');
    }
  }

  async function handleConvertToFacture(proforma: Proforma) {
  try {
    
    const factureAcreer: Facture = {
      id: 0,
      numero: generateNumber('FAC', getNextFacture()),
      client: proforma.client,
      items: proforma.items,
      dateEmission: new Date().toISOString(),
      dateEcheance: proforma.dateValidite,
      montantHT: proforma.montantHT,
      tva: proforma.tva,
      montantTTC: proforma.montantTTC,
      statut: 'Brouillon',
      notes: `Créée depuis la proforma ${proforma.numero}`,
    };

    const factureResponse = await api.post(
      'http://localhost:3000/factures',
      factureAcreer,
    );

    console.log(
      'Facture créée depuis la conversion:',
      factureResponse.data,
    );

    const factureCreee: Facture = factureResponse.data.facture;

    addFacture(factureCreee);

    const updatedProforma = {
      ...proforma,
      factureNumero: factureCreee.numero,
    };

    const proformaResponse = await api.put(
      `http://localhost:3000/proformas/${proforma.id}`,
      updatedProforma,
    );

    console.log(
      'Proforma mise à jour après conversion:',
      proformaResponse.data,
    );

    const proformaModifiee: Proforma =
      proformaResponse.data.proforma;

    updateProforma(proformaModifiee);

    setProformasBackend((current) =>
      current.map((item) =>
        item.id === proformaModifiee.id
          ? proformaModifiee
          : item,
      ),
    );

    addNotification({
      title: 'Proforma convertie',
      message: `La proforma ${proforma.numero} a été convertie en facture ${factureCreee.numero}.`,
      createdAt: Date.now(),
      type: 'proforma',
    });

    setProformaToConvert(null);

    toast.success(
      'Proforma convertie en facture avec succès !',
    );
  } catch (error) {
    console.error(
      'Erreur lors de la conversion de la proforma:',
      error,
    );

    toast.error(
      'Impossible de convertir la proforma en facture.',
    );
  }
}

  function confirmConvertToFacture() {
    if (!proformaToConvert) return;

    handleConvertToFacture(proformaToConvert);
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

      <ProformaSearch value={search} onChange={setSearch} />

      {/* Tableau */}

      <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[900px]">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Numéro</th>

              <th>Client</th>

              <th>Montant TTC</th>

              <th>Statut</th>

              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProformas.map((proforma) => (
              <tr key={proforma.id} className="border-t hover:bg-slate-50">
                <td className="whitespace-nowrap p-4 font-semibold">
                  {proforma.numero}
                </td>

                <td className="whitespace-nowrap">{proforma.client}</td>

                <td className="whitespace-nowrap">
                  {proforma.montantTTC.toLocaleString()} FCFA
                </td>

                <td className="whitespace-nowrap">
                  <select
                    value={proforma.statut}
                    onChange={(e) => {
                      const nouveauStatut = e.target
                        .value as Proforma['statut'];

                      handleUpdateProforma({
                        ...proforma,
                        statut: nouveauStatut,
                      });
                    }}
                    className={`rounded-full px-3 py-1 text-xs font-medium outline-none cursor-pointer ${
                      proforma.statut === 'Acceptée'
                        ? 'bg-green-100 text-green-700'
                        : proforma.statut === 'Envoyée'
                          ? 'bg-blue-100 text-blue-700'
                          : proforma.statut === 'Refusée'
                            ? 'bg-red-100 text-red-700'
                            : proforma.statut === 'Expirée'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    <option value="Brouillon">Brouillon</option>
                    <option value="Envoyée">Envoyée</option>
                    <option value="Acceptée">Acceptée</option>
                    <option value="Refusée">Refusée</option>
                    <option value="Expirée">Expirée</option>
                  </select>
                </td>

                <td className="whitespace-nowrap">
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
                      onClick={() => generateProformaPdf(proforma, 'print')}
                      className="rounded-lg bg-indigo-100 p-2 text-indigo-600 hover:bg-indigo-200"
                      title="Imprimer"
                    >
                      <Printer size={18} />
                    </button>

                    {proforma.factureNumero ? (
                      <div
                        className="
      rounded-lg
      bg-emerald-100
      px-3
      py-2
      text-sm
      font-medium
      text-emerald-700
    "
                        title={`Convertie en ${proforma.factureNumero}`}
                      >
                        {proforma.factureNumero}
                      </div>
                    ) : (
                      <button
                        onClick={() => setProformaToConvert(proforma)}
                        className="rounded-lg bg-violet-100 p-2 text-violet-600 hover:bg-violet-200"
                        title="Transformer en facture"
                      >
                        <Receipt size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Sheet
        isOpen={isOpen}
        title="Nouvelle proforma"
        size="lg"
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
      </Sheet>
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

      {proformaToConvert && (
        <Modal
          isOpen={!!proformaToConvert}
          title="Convertir en facture ?"
          onClose={() => setProformaToConvert(null)}
        >
          <div className="space-y-5">
            <p className="text-gray-600">
              Vous êtes sur le point de convertir la proforma{' '}
              <span className="font-semibold">{proformaToConvert.numero}</span>{' '}
              en facture.
            </p>

            <p className="text-sm text-gray-500">
              Une nouvelle facture sera créée à partir de cette proforma.
            </p>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setProformaToConvert(null)}
                className="
    w-full
    rounded-lg
    border
    px-4
    py-2
    hover:bg-gray-100
    sm:w-auto
  "
              >
                Annuler
              </button>

              <button
                onClick={confirmConvertToFacture}
                className="
    w-full
    rounded-lg
    bg-violet-600
    px-4
    py-2
    text-white
    hover:bg-violet-700
    sm:w-auto
  "
              >
                Convertir
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
