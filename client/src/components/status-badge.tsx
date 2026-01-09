import { CheckCircle, AlertTriangle, Clock } from "lucide-react";

interface StatusBadgeProps {
  status: "active" | "warning" | "released";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
        <CheckCircle className="w-4 h-4" />
        Active
      </span>
    );
  }

  if (status === "warning") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 border border-amber-200">
        <AlertTriangle className="w-4 h-4" />
        Warning
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-rose-100 text-rose-800 border border-rose-200">
      <Clock className="w-4 h-4" />
      Released
    </span>
  );
}
