import { ButtonHTMLAttributes, ReactNode } from "react";

type Tone = "default" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  tone?: Tone;
  children: ReactNode;
}

function buildClasses({
  variant,
  tone,
  className,
}: {
  variant: "primary" | "secondary";
  tone: Tone;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-midnight-950 disabled:cursor-not-allowed disabled:opacity-60";

  const variantClass =
    variant === "primary"
      ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 text-white shadow-glow hover:scale-[1.01]"
      : "border border-midnight-700 bg-midnight-900/40 text-slate-100 hover:border-indigo-400/70 hover:text-white";

  const toneClass =
    tone === "danger"
      ? "border border-red-400/50 text-red-200 hover:bg-red-400/10"
      : "";

  return [base, variantClass, toneClass, className].filter(Boolean).join(" ");
}

function Spinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white" />
  );
}

export function PrimaryButton({
  loading,
  tone = "default",
  className,
  children,
  type = "button",
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buildClasses({ variant: "primary", tone, className })}
      disabled={loading || disabled}
      {...rest}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

export function SecondaryButton({
  loading,
  tone = "default",
  className,
  children,
  type = "button",
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buildClasses({ variant: "secondary", tone, className })}
      disabled={loading || disabled}
      {...rest}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
