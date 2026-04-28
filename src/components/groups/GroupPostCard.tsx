interface GroupPostCardProps {
  author: {
    displayName: string;
    nickname: string;
    avatarUrl: string | null;
  };
  content: string;
  createdAt: string;
  onDelete?: () => void;
  canDelete?: boolean;
}

export function GroupPostCard({ author, content, createdAt, onDelete, canDelete }: GroupPostCardProps) {
  const formattedDate = new Date(createdAt).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="rounded-2xl border border-midnight-800 bg-midnight-900/60 p-4 shadow-soft">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-indigo-500/30">
          {author.avatarUrl ? (
            <img
              src={author.avatarUrl}
              alt={author.displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-white">
              {author.displayName.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold text-white">{author.displayName}</p>
              <p className="text-xs text-slate-500">@{author.nickname}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-slate-500">{formattedDate}</span>
              {canDelete && onDelete && (
                <button
                  onClick={onDelete}
                  className="rounded-lg p-1.5 text-red-400 hover:bg-red-500/20 transition"
                  title="Deletar"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          <p className="mt-2 text-sm text-slate-300 whitespace-pre-wrap break-words">{content}</p>
        </div>
      </div>
    </div>
  );
}
