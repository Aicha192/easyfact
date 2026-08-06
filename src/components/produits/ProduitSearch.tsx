import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function ProduitSearch({
  value,
  onChange,
}: Props) {
  return (
    <div className="relative">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rechercher un produit..."
        className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
      />
    </div>
  );
}