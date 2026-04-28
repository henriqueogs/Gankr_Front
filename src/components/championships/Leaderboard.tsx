interface LeaderboardEntry {
  position: number;
  user: {
    id: string;
    displayName: string;
    nickname: string;
    avatarUrl: string | null;
  };
  score: number;
  playtime: number;
  playtime2weeks: number;
  achievements: number;
  baselinePlaytime: number;
  baselineAchievements: number;
  deltaPlaytime: number;
  deltaAchievements: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  metric?:
    | "PLAYTIME_DELTA"
    | "ACHIEVEMENTS_DELTA"
    | "PLAYTIME_2WEEKS"
    | "PLAYTIME"
    | "ACHIEVEMENTS";
}

const formatHours = (minutes: number) => `${(minutes / 60).toFixed(1)}h`;

export function Leaderboard({ entries, metric }: LeaderboardProps) {
  const metricLabel =
    metric === "PLAYTIME_DELTA"
      ? "Tempo ganho no período"
      : metric === "ACHIEVEMENTS_DELTA"
      ? "Conquistas ganhas no período"
      : metric === "PLAYTIME_2WEEKS"
      ? "Tempo últimas 2 semanas"
      : metric === "ACHIEVEMENTS"
      ? "Conquistas"
      : "Tempo total";

  return (
    <div className="rounded-3xl border border-midnight-800/70 bg-midnight-900/60 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Leaderboard</h3>
        <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs text-indigo-200">
          Métrica: {metricLabel}
        </span>
      </div>

      {entries.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">
          Sem dados suficientes para ranking.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.user.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-midnight-800/70 bg-midnight-950/40 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-semibold text-indigo-200">
                  {entry.position}
                </div>
                <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-700">
                  {entry.user.avatarUrl ? (
                    <img
                      src={entry.user.avatarUrl}
                      alt={entry.user.displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
                      {entry.user.displayName[0]}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {entry.user.displayName}
                  </p>
                  <p className="text-xs text-slate-500">
                    @{entry.user.nickname}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-indigo-200">
                  Score: {metric === "ACHIEVEMENTS_DELTA"
                    ? entry.deltaAchievements
                    : metric === "PLAYTIME_2WEEKS"
                    ? formatHours(entry.playtime2weeks)
                    : metric === "ACHIEVEMENTS"
                    ? entry.achievements
                    : metric === "PLAYTIME_DELTA"
                    ? formatHours(entry.deltaPlaytime)
                    : formatHours(entry.playtime)}
                </span>
                <span>⏱ {formatHours(entry.playtime)}</span>
                <span>📈 +{formatHours(entry.deltaPlaytime)}</span>
                <span>🏆 {entry.achievements}</span>
                <span>✨ +{entry.deltaAchievements}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
