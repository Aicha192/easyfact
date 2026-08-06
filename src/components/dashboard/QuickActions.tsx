import { Plus, FileText, Users } from "lucide-react";

interface Props {
  onNewFacture: () => void;
  onNewClient: () => void;
  onNewProforma: () => void;
}

export default function QuickActions({
  onNewFacture,
  onNewClient,
  onNewProforma,
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">

      <h2 className="mb-5 text-xl font-semibold">
        Actions rapides
      </h2>

      <div className="space-y-4">

        <button
          onClick={onNewFacture}
          className="
            flex w-full items-center gap-3 
            rounded-xl bg-emerald-600 
            px-4 py-3 text-white 
            transition hover:bg-emerald-700
          "
        >
          <Plus size={20} />
          Nouvelle facture
        </button>

        <button
          onClick={onNewClient}
          className="
            flex w-full items-center gap-3 
            rounded-xl border px-4 py-3 
            transition hover:bg-slate-100
          "
        >
          <Users size={20} />
          Nouveau client
        </button>

        <button
          onClick={onNewProforma}
          className="
            flex w-full items-center gap-3 
            rounded-xl border px-4 py-3 
            transition hover:bg-slate-100
          "
        >
          <FileText size={20} />
          Nouvelle proforma
        </button>

      </div>

    </div>
  );
}