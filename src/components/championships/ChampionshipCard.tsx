import { Link } from 'react-router-dom';

interface ChampionshipCardProps {
  id: string;
  name: string;
  game: {
    name: string;
    appId: string;
  };
  metric: string;
  status: string;
  startDate: string;
  endDate: string;
}

export function ChampionshipCard({ id, name, game, metric, status, startDate, endDate }: ChampionshipCardProps) {
  const statusColors = {
    DRAFT: 'bg-slate-700 text-slate-300',
    ACTIVE: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40',
    FINISHED: 'bg-midnight-800 text-slate-400',
  };

  const metricLabels: Record<string, string> = {
    PLAYTIME_DELTA: 'Tempo ganho no período',
    ACHIEVEMENTS_DELTA: 'Conquistas ganhas no período',
    PLAYTIME_2WEEKS: 'Tempo nas últimas 2 semanas',
    PLAYTIME: 'Tempo de Jogo',
    ACHIEVEMENTS: 'Conquistas',
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
  };

  return (
    <Link
      to={`/championships/${id}`}
      className="group relative rounded-shell border border-midnight-800/70 bg-gradient-to-br from-midnight-900/70 to-midnight-900/20 p-5 shadow-soft transition hover:-translate-y-1 hover:border-indigo-400/60 hover:shadow-glow"
    >
      <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <span className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-indigo-500/30 blur-3xl" />
      </div>
      <div className="relative space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Campeonato</p>
            <h3 className="truncate text-lg font-semibold text-white" title={name}>{name}</h3>
            <p className="truncate text-sm text-indigo-300">{game.name}</p>
          </div>
          <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest ${statusColors[status as keyof typeof statusColors] || statusColors.DRAFT}`}>
            {status === 'ACTIVE' ? 'Ativo' : status === 'FINISHED' ? 'Finalizado' : 'Rascunho'}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>📊 {metricLabels[metric] || metric}</span>
          <span>{formatDate(startDate)} - {formatDate(endDate)}</span>
        </div>
        <div className="text-xs uppercase tracking-[0.35em] text-slate-500 transition group-hover:text-indigo-200">
          Ver Ranking →
        </div>
      </div>
    </Link>
  );
}
