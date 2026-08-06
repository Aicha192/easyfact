import Badge from "../ui/Badge";
import { Pencil, Trash2 } from "lucide-react";

import type { Client } from "../../types/client";

interface Props {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

export default function ClientTable({ clients, onEdit, onDelete }: Props) {
  function getInitials(name: string) {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <table className="w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-4 text-left">Nom</th>

            <th>Téléphone</th>
            <th>Adresse</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="border-t hover:bg-slate-50">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-700">
                    {getInitials(client.nom)}
                  </div>

                  <div>
                    <p className="font-semibold text-slate-800">{client.nom}</p>

                    <p className="text-sm text-slate-500">{client.email}</p>
                  </div>
                </div>
              </td>

              <td>{client.telephone}</td>

              <td>{client.adresse}</td>

              <td>
                <Badge color={client.statut === "Actif" ? "green" : "red"}>
                  {client.statut}
                </Badge>
              </td>

              <td>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(client)}
                    className="rounded-lg bg-blue-100 p-2 text-blue-600 transition hover:scale-105 hover:bg-blue-200"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => onDelete(client)}
                    className="rounded-lg bg-red-100 p-2 text-red-600 transition hover:scale-105 hover:bg-red-200"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
