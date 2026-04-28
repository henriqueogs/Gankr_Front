import { GroupStatsData } from "../../services/useGroupStats";
import { SecondaryButton } from "../ui/Buttons";

interface GroupStatsProps {
  stats: GroupStatsData | null;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  variant?: "compact" | "full";
}

const formatHours = (minutes: number) => {
  const hours = minutes / 60;
  return `${hours.toFixed(1)}h`;
};

const buildSteamIconUrl = (appId: string, iconUrl?: string | null) => {
  if (!iconUrl) return null;
  if (iconUrl.startsWith("http")) return iconUrl;
  return `https://media.steampowered.com/steamcommunity/public/images/apps/${appId}/${iconUrl}.jpg`;
};

export function GroupStats({
  stats,
  loading,
  error,
  onRefresh,
  variant = "full",
}: GroupStatsProps) {
  const topGames = stats?.topGames ?? [];
  const showTopGames = variant === "full" ? topGames : topGames.slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            Estatísticas do grupo
          </h2>
          <p className="text-sm text-slate-400">
            Visão geral do desempenho coletivo.
          </p>
        </div>
        {onRefresh && (
          <SecondaryButton onClick={onRefresh}>Atualizar</SecondaryButton>
        )}
      </div>

      {loading && (
        <p className="text-sm text-slate-400">Carregando estatísticas...</p>
      )}
      {error && (
        <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-3 text-xs text-red-200">
          {error}
        </div>
      )}

      {!loading && !error && stats && (
        <>
          <div className="grid gap-3 md:grid-cols-4">
            {[
              {
                label: "Membros",
                value: stats.totalMembers,
              },
              {
                label: "Horas totais",
                value: formatHours(stats.totalPlaytime),
              },
              {
                label: "Últimas 2 semanas",
                value: formatHours(stats.totalPlaytime2weeks),
              },
              {
                label: "Conquistas",
                value: stats.totalAchievements,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-midnight-800/70 bg-midnight-900/60 p-4 text-sm text-slate-300"
              >
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-midnight-800/70 bg-midnight-900/60 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Jogos mais jogados
              </h3>
              <span className="text-xs text-slate-500">
                {stats.gamesCount} jogos no total
              </span>
            </div>
            {showTopGames.length === 0 ? (
              <p className="mt-3 text-sm text-slate-400">
                Sem dados suficientes para exibir jogos.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {showTopGames.map((game) => (
                  <div
                    key={game.game.appId}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-midnight-800/70 bg-midnight-950/40 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-xl bg-indigo-500/20">
                        {buildSteamIconUrl(
                          game.game.appId,
                          game.game.iconUrl,
                        ) ? (
                          <img
                            src={
                              buildSteamIconUrl(
                                game.game.appId,
                                game.game.iconUrl,
                              ) as string
                            }
                            alt={game.game.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-xs text-white">
                            {game.game.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {game.game.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {game.playersCount} jogadores
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span>⏱ {formatHours(game.totalPlaytime)}</span>
                      <span>🔥 {formatHours(game.totalPlaytime2weeks)}</span>
                      <span>🏆 {game.totalAchievements}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
