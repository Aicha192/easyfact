interface ClientSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ClientSearch({
  value,
  onChange,
}: ClientSearchProps) {
  return (
    <input
      type="text"
      placeholder="Rechercher un client..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 focus:border-emerald-600 focus:outline-none"
    />
  );
}