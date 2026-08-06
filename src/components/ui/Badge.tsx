interface BadgeProps {
  children: React.ReactNode;
  color?: "green" | "orange" | "red" | "blue" | "gray";
}

const colors = {
  green: "bg-emerald-100 text-emerald-700",
  orange: "bg-orange-100 text-orange-700",
  red: "bg-red-100 text-red-700",
  blue: "bg-blue-100 text-blue-700",
  gray: "bg-slate-100 text-slate-700",
};

export default function Badge({
  children,
  color = "gray",
}: BadgeProps) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-medium ${colors[color]}`}
    >
      {children}
    </span>
  );
}