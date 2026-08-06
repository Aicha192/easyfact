import { useFactureStore } from "../../store/factureStore";

export default function RecentInvoices() {
  const factures = useFactureStore((state) => state.factures);

  const invoices = factures.slice(-5).reverse();

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">Dernières factures</h2>

      <table className="w-full">
        <thead>
          <tr className="border-b text-left text-gray-500">
            <th className="pb-3">N°</th>
            <th className="pb-3">Client</th>
            <th className="pb-3">Montant</th>
            <th className="pb-3">Statut</th>
          </tr>
        </thead>

        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.numero} className="border-b">
              <td className="py-4">{invoice.id}</td>
              <td>{invoice.client}</td>
              <td>{invoice.montantTTC.toLocaleString("fr-FR")} FCFA</td>

              <td>
                <span
                  className={`
    rounded-full px-3 py-1 text-sm
    ${
      invoice.statut === "Payée"
        ? "bg-emerald-100 text-emerald-700"
        : invoice.statut === "En retard"
          ? "bg-red-100 text-red-700"
          : "bg-yellow-100 text-yellow-700"
    }
  `}
                >
                  {invoice.statut}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
