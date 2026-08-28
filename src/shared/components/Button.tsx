import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "success" | "option";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  fullWidth?: boolean;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-ink/90",
  secondary: "bg-mist text-ink hover:bg-line",
  ghost: "bg-transparent text-slate hover:bg-mist",
  danger: "bg-clay text-white hover:bg-clay/90",
  success: "bg-green text-white hover:bg-green/90",
  option: "bg-blue text-white hover:bg-blue/90",
};

export function Button({
  children,
  variant = "primary",
  fullWidth = false,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium
        transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed
        ${VARIANT_CLASSES[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
