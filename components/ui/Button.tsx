import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

export type UIButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white border-transparent",
  secondary: "bg-slate-700 hover:bg-slate-800 text-white border-transparent",
  danger: "bg-red-600 hover:bg-red-700 text-white border-transparent",
  ghost: "bg-transparent hover:bg-slate-50 text-slate-900 border-slate-200",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-base",
};

export default function UIButton({
  variant = "primary",
  size = "md",
  className,
  type,
  disabled,
  ...props
}: UIButtonProps) {
  return (
    <button
      type={type ?? "button"}
      disabled={disabled}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded border font-semibold transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-blue-200",
        disabled && "opacity-60 cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}

