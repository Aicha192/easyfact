import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
}

export default function Input({
  label,
  icon,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}

       <input
  {...props}
  className={`w-full rounded-xl border border-slate-300 ${
    icon ? 'pl-11' : 'pl-4'
  } pr-4 py-3
  focus:border-emerald-600
  focus:outline-none
  focus:ring-2
  focus:ring-emerald-200
  disabled:bg-slate-100
  disabled:text-slate-500
  disabled:cursor-not-allowed
  disabled:border-slate-300
  ${className}`}
/>
      </div>
    </div>
  );
}
