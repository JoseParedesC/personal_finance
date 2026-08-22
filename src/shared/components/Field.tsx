import type { ReactNode } from "react";

interface FieldProps {
  label: string;
  error?: string;
  children: ReactNode;
  htmlFor?: string;
}

export function Field({ label, error, children, htmlFor }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-medium uppercase tracking-wide text-slate">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-clay">{error}</p>}
    </div>
  );
}
