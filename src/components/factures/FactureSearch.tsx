interface FactureSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function FactureSearch({
  value,
  onChange,
}: FactureSearchProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Rechercher une facture..."
      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
    />
  );
}