import { Search } from "lucide-react";

interface FactureSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function FactureSearch({
  value,
  onChange,
}: FactureSearchProps) {
 return (
  <div className="relative w-full">
    <Search
      size={18}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
    />

    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Rechercher une facture..."
      className="
        w-full
        rounded-xl
        border
        border-slate-200
        bg-slate-50
        py-3
        pl-10
        pr-4
        outline-none
        transition
        focus:border-emerald-600
        focus:ring-2
        focus:ring-emerald-100
      "
    />
  </div>
);
}