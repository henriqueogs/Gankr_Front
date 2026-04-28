import { RoleBadge } from "./RoleBadge";
import { SecondaryButton } from "../ui/Buttons";

interface MemberRowProps {
  displayName: string;
  nickname: string;
  role: string;
  avatarUrl?: string | null;
  isOwner: boolean;
  canRemove?: boolean;
  removing?: boolean;
  onRemove?: () => void;
}

export function MemberRow({
  displayName,
  nickname,
  role,
  avatarUrl,
  isOwner,
  canRemove,
  removing,
  onRemove,
}: MemberRowProps) {
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-midnight-800/70 bg-midnight-900/30 p-4 shadow-soft">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 overflow-hidden rounded-2xl bg-midnight-800 text-center text-base font-semibold text-slate-200">
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{displayName}</p>
          <p className="text-xs text-slate-400">@{nickname}</p>
        </div>
      </div>
      <RoleBadge role={isOwner ? "OWNER" : role} />
      {canRemove && (
        <SecondaryButton tone="danger" className="ml-auto" onClick={onRemove} loading={removing}>
          Remover
        </SecondaryButton>
      )}
    </div>
  );
}
