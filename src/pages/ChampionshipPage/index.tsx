import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { AppLayout } from "../../components/layout/AppLayout";
import { Leaderboard } from "../../components/championships/Leaderboard";
import { SecondaryButton } from "../../components/ui/Buttons";
import { api, getApiErrorMessage } from "../../api/client";
import { useChampionshipLeaderboard } from "../../services";

interface ChampionshipDetail {
  id: string;
  groupId: string;
  name: string;
  metric:
    | "PLAYTIME_DELTA"
    | "ACHIEVEMENTS_DELTA"
    | "PLAYTIME_2WEEKS"
    | "PLAYTIME"
    | "ACHIEVEMENTS";
  status: "DRAFT" | "ACTIVE" | "FINISHED";
  startDate: string;
  endDate: string;
  game: {
    appId: string;
    name: string;
    iconUrl?: string | null;
    logoUrl?: string | null;
  };
  group: {
    id: string;
    name: string;
    nickname: string;
  };
}

interface GameDetails {
  appId: string;
  name: string;
  description?: string | null;
  shortDescription?: string | null;
  iconUrl?: string | null;
  logoUrl?: string | null;
}

const statusStyles: Record<string, string> = {
  DRAFT: "bg-slate-700 text-slate-300",
  ACTIVE: "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40",
  FINISHED: "bg-midnight-800 text-slate-400",
};

const metricLabels: Record<string, string> = {
  PLAYTIME_DELTA: "Tempo ganho no período",
  ACHIEVEMENTS_DELTA: "Conquistas ganhas no período",
  PLAYTIME_2WEEKS: "Tempo nas últimas 2 semanas",
  PLAYTIME: "Tempo de jogo",
  ACHIEVEMENTS: "Conquistas",
};

const metricRules: Record<
  ChampionshipDetail["metric"],
  { title: string; scoreRule: string; note: string }
> = {
  PLAYTIME_DELTA: {
    title: "Tempo ganho no período",
    scoreRule:
      "A pontuação é o aumento de tempo jogado entre o início e o estado atual do campeonato.",
    note: "Se dois jogadores empatam, o sistema usa critérios secundários para desempate.",
  },
  ACHIEVEMENTS_DELTA: {
    title: "Conquistas ganhas no período",
    scoreRule:
      "A pontuação é a quantidade de conquistas novas desbloqueadas durante o período do campeonato.",
    note: "Conquistas antigas (antes da criação) não entram na pontuação.",
  },
  PLAYTIME_2WEEKS: {
    title: "Tempo nas últimas 2 semanas",
    scoreRule:
      "A pontuação usa o campo de minutos jogados nas últimas 2 semanas fornecido pela Steam.",
    note: "Essa janela é móvel na Steam e pode variar conforme novas sincronizações.",
  },
  PLAYTIME: {
    title: "Tempo total de jogo",
    scoreRule:
      "A pontuação usa o tempo total acumulado no jogo conforme sincronizado da Steam.",
    note: "Métrica legada, pode favorecer quem já tinha muitas horas antes do campeonato.",
  },
  ACHIEVEMENTS: {
    title: "Conquistas totais",
    scoreRule:
      "A pontuação usa o total atual de conquistas desbloqueadas no jogo.",
    note: "Métrica legada, considera histórico completo e não apenas o período.",
  },
};

export function ChampionshipPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [championship, setChampionship] = useState<ChampionshipDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameDetails, setGameDetails] = useState<GameDetails | null>(null);
  const [gameLoading, setGameLoading] = useState(false);
  const [gameError, setGameError] = useState<string | null>(null);

  const {
    leaderboard,
    loading: leaderboardLoading,
    error: leaderboardError,
    refetch,
  } = useChampionshipLeaderboard(id ?? "");

  useEffect(() => {
    const fetchChampionship = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<ChampionshipDetail>(`/championships/${id}`);
        setChampionship(response.data);
      } catch (err: unknown) {
        const msg = getApiErrorMessage(err, "Falha ao carregar campeonato");
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchChampionship();
  }, [id]);

  useEffect(() => {
    const fetchGameDetails = async () => {
      if (!championship?.game.appId) return;
      setGameLoading(true);
      setGameError(null);

      try {
        const response = await api.get<GameDetails>(
          `/games/${championship.game.appId}`,
        );
        setGameDetails(response.data);
      } catch {
        setGameDetails(null);
        setGameError("Não foi possível carregar os detalhes do jogo.");
      } finally {
        setGameLoading(false);
      }
    };

    fetchGameDetails();
  }, [championship?.game.appId]);

  const formattedDates = useMemo(() => {
    if (!championship) return "";
    const start = new Date(championship.startDate).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const end = new Date(championship.endDate).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return `${start} • ${end}`;
  }, [championship]);

  const durationLabel = useMemo(() => {
    if (!championship) return "";
    const start = new Date(championship.startDate).getTime();
    const end = new Date(championship.endDate).getTime();
    const diffDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    return `${diffDays} dia${diffDays > 1 ? "s" : ""}`;
  }, [championship]);

  const storeUrl = championship
    ? `https://store.steampowered.com/app/${championship.game.appId}`
    : "";

  const gameDescription =
    gameDetails?.description ||
    gameDetails?.shortDescription ||
    "Descrição indisponível para este jogo.";

  return (
    <AppLayout>
      {loading && (
        <div className="rounded-shell border border-midnight-800/70 p-8 text-center text-slate-400">
          <span className="mr-3 inline-block h-5 w-5 animate-spin rounded-full border-2 border-indigo-500/40 border-t-indigo-300" />
          Carregando campeonato...
        </div>
      )}

      {error && (
        <div className="rounded-3xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {!loading && championship && (
        <>
          <section className="rounded-shell border border-midnight-800/80 bg-gradient-to-br from-midnight-900/80 to-midnight-900/30 p-8 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                  Campeonato
                </p>
                <h1 className="text-4xl font-bold text-white">
                  {championship.name}
                </h1>
                <p className="text-slate-400">{championship.game.name}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <SecondaryButton
                  onClick={() => navigate(`/social/groups/${championship.groupId}`)}
                >
                  Voltar ao grupo
                </SecondaryButton>
                <SecondaryButton
                  onClick={() => navigate(`/games/${championship.game.appId}`)}
                >
                  Abrir página do jogo
                </SecondaryButton>
                <a
                  href={storeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-midnight-700 bg-midnight-900/40 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-indigo-400/70 hover:text-white"
                >
                  Ver na Steam
                </a>
                <SecondaryButton onClick={refetch}>Atualizar ranking</SecondaryButton>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 rounded-3xl border border-midnight-800/70 bg-midnight-900/40 p-5">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest ${
                  statusStyles[championship.status]
                }`}
              >
                {championship.status === "ACTIVE"
                  ? "Ativo"
                  : championship.status === "FINISHED"
                  ? "Finalizado"
                  : "Rascunho"}
              </span>
              <span className="text-sm text-slate-300">
                Métrica: {metricLabels[championship.metric]}
              </span>
              <span className="text-sm text-slate-300">{formattedDates}</span>
              <span className="text-sm text-slate-300">
                Grupo: {championship.group.name}
              </span>
              <span className="text-sm text-slate-300">Duração: {durationLabel}</span>
            </div>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="overflow-hidden rounded-shell border border-midnight-800/80 bg-midnight-900/60 shadow-soft">
              <div className="relative h-52 w-full overflow-hidden border-b border-midnight-800/70">
                <img
                  src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${championship.game.appId}/library_hero.jpg`}
                  alt={championship.game.name}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src = `https://cdn.cloudflare.steamstatic.com/steam/apps/${championship.game.appId}/header.jpg`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight-950/90 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                    Jogo oficial
                  </p>
                  <p className="text-xl font-semibold text-white">
                    {championship.game.name}
                  </p>
                </div>
              </div>

              <div className="p-6">
                {gameLoading && (
                  <p className="text-sm text-slate-400">
                    Carregando descrição do jogo...
                  </p>
                )}
                {gameError && (
                  <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-3 text-xs text-red-200">
                    {gameError}
                  </div>
                )}
                {!gameLoading && !gameError && (
                  <div
                    className="prose prose-invert prose-sm max-w-none text-slate-300"
                    dangerouslySetInnerHTML={{ __html: gameDescription }}
                  />
                )}
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-shell border border-midnight-800/80 bg-midnight-900/60 p-5 shadow-soft">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                  Detalhes rápidos
                </p>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-slate-400">AppID</dt>
                    <dd className="font-semibold text-white">{championship.game.appId}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-slate-400">Grupo</dt>
                    <dd className="font-semibold text-white">
                      {championship.group.name} (@{championship.group.nickname})
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-slate-400">Status</dt>
                    <dd className="font-semibold text-white">
                      {championship.status === "ACTIVE"
                        ? "Ativo"
                        : championship.status === "FINISHED"
                        ? "Finalizado"
                        : "Rascunho"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-slate-400">Métrica</dt>
                    <dd className="font-semibold text-white">
                      {metricLabels[championship.metric]}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-slate-400">Período</dt>
                    <dd className="font-semibold text-white">{formattedDates}</dd>
                  </div>
                </dl>
              </div>
            </aside>
          </section>

          <section className="mt-6 rounded-shell border border-midnight-800/80 bg-midnight-900/60 p-6 shadow-soft">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
              Regras do campeonato
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              {metricRules[championship.metric].title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              {metricRules[championship.metric].scoreRule}
            </p>
            <p className="mt-3 text-xs text-slate-400">
              {metricRules[championship.metric].note}
            </p>
            <div className="mt-5 rounded-2xl border border-midnight-800/80 bg-midnight-950/40 p-4 text-xs text-slate-400">
              Desempate:
              {" "}
              primeiro por score principal da métrica, depois por ganho de tempo
              (quando aplicável) e por ganho de conquistas.
            </div>
          </section>

          <section className="mt-6 space-y-4">
            {leaderboardLoading && (
              <p className="text-sm text-slate-400">
                Carregando leaderboard...
              </p>
            )}
            {leaderboardError && (
              <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-3 text-xs text-red-200">
                {leaderboardError}
              </div>
            )}
            {!leaderboardLoading && !leaderboardError && (
              <Leaderboard
                entries={leaderboard}
                metric={championship.metric}
              />
            )}
          </section>
        </>
      )}
    </AppLayout>
  );
}
