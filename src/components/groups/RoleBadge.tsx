interface RoleBadgeProps {
  role?: string | null;
}

const roleStyles: Record<string, string> = {
  OWNER: "bg-gradient-to-r from-aurum-300 to-aurum-500 text-midnight-900 shadow-glow",
  ADMIN: "bg-indigo-500/20 text-indigo-200 border border-indigo-400/40",
  MEMBER: "bg-midnight-900/60 text-slate-300 border border-midnight-700",
};

const roleLabels: Record<string, string> = {
  OWNER: "Líder",
  ADMIN: "Admin",
  MEMBER: "Membro",
};

export function RoleBadge({ role }: RoleBadgeProps) {
  const normalized = role?.toUpperCase() ?? "MEMBER";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-widest",
        roleStyles[normalized] ?? roleStyles.MEMBER,
      ].join(" ")}
    >
      {roleLabels[normalized] ?? normalized}
    </span>
  );
}
