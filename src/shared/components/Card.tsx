import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-surface rounded-xl2 border border-line shadow-soft ${className}`}
    >
      {children}
    </div>
  );
}
