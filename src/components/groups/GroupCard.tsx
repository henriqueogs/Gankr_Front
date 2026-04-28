import { Link } from "react-router-dom";

import { RoleBadge } from "./RoleBadge";

interface GroupCardProps {
  id: string;
  name: string;
  nickname: string;
  membersCount: number;
  membershipRole?: string | null;
}

export function GroupCard({
  id,
  name,
  nickname,
  membersCount,
  membershipRole,
}: GroupCardProps) {
  return (
    <Link
      to={`/social/groups/${id}`}
      className="group relative overflow-hidden rounded-shell border border-midnight-800/70 bg-gradient-to-br from-midnight-900/70 to-midnight-900/20 p-5 shadow-soft transition hover:-translate-y-1 hover:border-indigo-400/60 hover:shadow-glow"
    >
      <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <span className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-indigo-500/30 blur-3xl" />
      </div>
      <div className="relative flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
              Grupo
            </p>
            <h3
              className="truncate text-xl font-semibold text-white"
              title={name}
            >
              {name}
            </h3>
            <p className="truncate text-sm text-slate-400">@{nickname}</p>
          </div>
          <div className="shrink-0">
            <RoleBadge role={membershipRole} />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-300">
          <span className="flex items-center gap-2 text-indigo-200">
            👥{" "}
            <strong className="text-base font-semibold">{membersCount}</strong>{" "}
            membros
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 transition group-hover:text-indigo-200">
            Ver detalhes
          </span>
        </div>
      </div>
    </Link>
  );
}
