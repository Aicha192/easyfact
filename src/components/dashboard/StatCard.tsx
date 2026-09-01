import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
}

export default function StatCard({ title, value, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-gray-500">{title}</p>

          <h2 className="mt-2 text-2xl font-bold">{value}</h2>
        </div>

        <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
}
