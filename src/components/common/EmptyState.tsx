import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl2 border border-dashed border-line bg-mist/40 px-6 py-16 text-center">
      <div className="rounded-full bg-mist p-3 text-slate">
        {icon ?? <Inbox size={22} />}
      </div>
      <p className="font-display text-lg font-medium text-ink">{title}</p>
      <p className="max-w-xs text-sm text-slate">{description}</p>
    </div>
  );
}
