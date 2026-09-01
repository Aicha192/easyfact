// @vitest-environment jsdom

import { describe, expect, it, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { useFactures } from '../hooks/useFactures';
import { useFactureStore } from '../store/factureStore';

function wrapper({ children }: { children: React.ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>;
}

describe('useFactures', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useFactureStore.setState({
      factures: [],
    });
  });

  it('retourne une liste vide au départ', () => {
    const { result } = renderHook(() => useFactures(), {
      wrapper,
    });

    expect(result.current.factures).toEqual([]);
    expect(result.current.filteredFactures).toEqual([]);
  });

  it('filtre les factures par numéro', () => {
    const facture1 = {
      id: 1,
      numero: 'FAC-2026-0001',
      client: 'Client A',
      items: [],
      dateEmission: '2026-08-01',
      dateEcheance: '2026-08-30',
      montantHT: 10000,
      tva: 18,
      montantTTC: 11800,
      statut: 'Brouillon' as const,
      notes: '',
    };

    const facture2 = {
      ...facture1,
      id: 2,
      numero: 'FAC-2026-0002',
      client: 'Client B',
    };

    useFactureStore.setState({
      factures: [facture1, facture2],
    });

    const { result } = renderHook(() => useFactures(), {
      wrapper,
    });

    act(() => {
      result.current.setSearch('0002');
    });

    expect(result.current.filteredFactures).toHaveLength(1);
    expect(result.current.filteredFactures[0].numero).toBe(
      'FAC-2026-0002',
    );
  });

  it('filtre les factures par statut', () => {
    const facture1 = {
      id: 1,
      numero: 'FAC-2026-0001',
      client: 'Client A',
      items: [],
      dateEmission: '2026-08-01',
      dateEcheance: '2026-08-30',
      montantHT: 10000,
      tva: 18,
      montantTTC: 11800,
      statut: 'Brouillon' as const,
      notes: '',
    };

    const facture2 = {
      ...facture1,
      id: 2,
      numero: 'FAC-2026-0002',
      statut: 'Payée' as const,
    };

    useFactureStore.setState({
      factures: [facture1, facture2],
    });

    const { result } = renderHook(() => useFactures(), {
      wrapper,
    });

    act(() => {
      result.current.setStatusFilter('Payée');
    });

    expect(result.current.filteredFactures).toHaveLength(1);
    expect(result.current.filteredFactures[0].statut).toBe('Payée');
  });
});