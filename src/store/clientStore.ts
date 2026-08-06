import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Client } from "../types/client";
import { clients as initialClients } from "../data/clients";

interface ClientStore {
  clients: Client[];

  addClient: (client: Client) => void;

  updateClient: (client: Client) => void;

  deleteClient: (id: number) => void;
}

export const useClientStore = create<ClientStore>()(
  persist(
    (set) => ({

  clients: initialClients,

  addClient: (client) =>
    set((state) => ({
      clients: [...state.clients, client],
    })),

  updateClient: (client) =>
    set((state) => ({
      clients: state.clients.map((c) =>
        c.id === client.id ? client : c
      ),
    })),

  deleteClient: (id) =>
    set((state) => ({
      clients: state.clients.filter(
        (c) => c.id !== id
      ),
    })),
    }),
    {
      name: "clients-storage",
    }
  )
);