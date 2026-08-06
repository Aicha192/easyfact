import type {
  TextareaHTMLAttributes,
} from "react";

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export default function Textarea({
  label,
  className = "",
  ...props
}: TextareaProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <textarea
        {...props}
        className={`min-h-28 w-full rounded-xl border border-slate-300 px-4 py-3 resize-none focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200 ${className}`}
      />
    </div>
  );
}