import { useEffect, useState } from 'react';
import api from '../lib/axios';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

import type { Facture } from '../types/facture';
import { useFactureStore } from '../store/factureStore';
import { useNotificationStore } from '../store/notificationStore';

export function useFactures() {
  const location = useLocation();

  const factures = useFactureStore((state) => state.factures);
  const setFactures = useFactureStore((state) => state.setFactures);
  const addFacture = useFactureStore((state) => state.addFacture);
  const updateFacture = useFactureStore((state) => state.updateFacture);
  const deleteFacture = useFactureStore((state) => state.deleteFacture);

  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Toutes');

  const [factureToDelete, setFactureToDelete] = useState<number | null>(
    null,
  );

  const [editingFacture, setEditingFacture] = useState<Facture | null>(
    null,
  );

  const [previewFacture, setPreviewFacture] = useState<Facture | null>(
    null,
  );

  // ============================================================
  // RÉCUPÉRATION DES FACTURES
  // ============================================================

  useEffect(() => {
    api
      .get<Facture[]>('/factures')
      .then((response) => {
        console.log(
          'Factures récupérées depuis NestJS:',
          response.data,
        );

        setFactures(response.data);
      })
      .catch((error) => {
        console.error(
          'Erreur lors de la récupération des factures:',
          error,
        );

        toast.error('Impossible de récupérer les factures.');
      });
  }, [setFactures]);

  // ============================================================
  // APERÇU D'UNE FACTURE
  // ============================================================

  useEffect(() => {
    const previewId = location.state?.previewId;

    if (!previewId) return;

    const facture = factures.find(
      (f) => f.id === previewId,
    );

    if (facture) {
      setPreviewFacture(facture);
    }
  }, [location.state, factures]);

  // ============================================================
  // RECHERCHE + FILTRE
  // ============================================================

  const filteredFactures = factures.filter((facture) => {
    const matchesSearch =
      facture.numero
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      facture.client
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'Toutes' ||
      facture.statut === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ============================================================
  // CRÉATION
  // ============================================================

  async function handleAddFacture(facture: Facture) {
    try {
      const response = await api.post(
        '/factures',
        facture,
      );

      console.log(
        'Facture créée depuis NestJS:',
        response.data,
      );

      const newFacture: Facture =
        response.data.facture;

      addFacture(newFacture);

      addNotification({
        title: 'Nouvelle facture créée',
        message: `La facture ${newFacture.numero} a été créée.`,
        createdAt: Date.now(),
        type: 'facture',
      });

      toast.success(
        'Facture créée avec succès !',
      );
    } catch (error) {
      console.error(
        'Erreur lors de la création de la facture:',
        error,
      );

      toast.error(
        'Impossible de créer la facture.',
      );
    }
  }

  // ============================================================
  // MODIFICATION
  // ============================================================

  async function handleUpdateFacture(
    updatedFacture: Facture,
  ) {
    try {
      const response = await api.put(
        `/factures/${updatedFacture.id}`,
        updatedFacture,
      );

      console.log(
        'Facture modifiée depuis NestJS:',
        response.data,
      );

      const factureModifiee: Facture =
        response.data.facture;

      updateFacture(factureModifiee);

      addNotification({
        title: 'Facture modifiée',
        message: `La facture ${factureModifiee.numero} a été modifiée.`,
        createdAt: Date.now(),
        type: 'facture',
      });

      toast.success(
        'Facture modifiée avec succès !',
      );
    } catch (error) {
      console.error(
        'Erreur lors de la modification de la facture:',
        error,
      );

      toast.error(
        'Impossible de modifier la facture.',
      );
    }
  }

  // ============================================================
  // SUPPRESSION
  // ============================================================

  async function handleDeleteFacture() {
    if (factureToDelete === null) return;

    const deletedFacture = factures.find(
      (facture) =>
        facture.id === factureToDelete,
    );

    try {
      const response = await api.delete(
        `/factures/${factureToDelete}`,
      );

      console.log(
        'Facture supprimée depuis NestJS:',
        response.data,
      );

      deleteFacture(factureToDelete);

      addNotification({
        title: 'Facture supprimée',
        message: `La facture ${
          deletedFacture?.numero ?? ''
        } a été supprimée.`,
        createdAt: Date.now(),
        type: 'facture',
      });

      setFactureToDelete(null);

      toast.success(
        'Facture supprimée avec succès !',
      );
    } catch (error) {
      console.error(
        'Erreur lors de la suppression de la facture:',
        error,
      );

      toast.error(
        'Impossible de supprimer la facture.',
      );
    }
  }

  // ============================================================
  // CHANGEMENT DE STATUT
  // ============================================================

  async function handleStatusChange(
    id: number,
    statut: Facture['statut'],
  ) {
    const facture = factures.find(
      (facture) => facture.id === id,
    );

    if (!facture) return;

    const factureModifiee: Facture = {
      ...facture,
      statut,
    };

    try {
      const response = await api.put(
        `/factures/${id}`,
        factureModifiee,
      );

      console.log(
        'Statut modifié depuis NestJS:',
        response.data,
      );

      const factureMiseAJour: Facture =
        response.data.facture;

      updateFacture(factureMiseAJour);

      toast.success(
        'Statut mis à jour !',
      );
    } catch (error) {
      console.error(
        'Erreur lors de la modification du statut:',
        error,
      );

      toast.error(
        'Impossible de mettre à jour le statut.',
      );
    }
  }

  return {
    factures,
    filteredFactures,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    factureToDelete,
    setFactureToDelete,

    editingFacture,
    setEditingFacture,

    previewFacture,
    setPreviewFacture,

    handleAddFacture,
    handleUpdateFacture,
    handleDeleteFacture,
    handleStatusChange,
  };
}