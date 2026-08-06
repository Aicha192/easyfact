import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export default function Button({
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className="w-full rounded-xl bg-emerald-600 py-3 text-white font-semibold transition hover:bg-emerald-700"
    >
      {children}
    </button>
  );
}