import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "../../components/layout/AppLayout";
import { PrimaryButton } from "../../components/ui/Buttons";
import { useAuth } from "../../hooks/useAuth";

import { gameApi } from "../../api/client";

// Mock game descriptions removed

export function GamePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState<string | null>(null);

  // Find game in user stats
  const userGameStat = user?.gameStats?.find((stat) => stat.game.appId === id);
  const game = userGameStat?.game;

  useEffect(() => {
    if (id) {
        gameApi.getDetails(id)
            .then(data => {
                setDescription(data.description || data.shortDescription || "Descrição indisponível.");
            })
            .catch(() => setDescription("Não foi possível carregar a descrição."))
            .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex h-64 items-center justify-center text-slate-400">
          Carregando...
        </div>
      </AppLayout>
    );
  }

  if (!game) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <h1 className="text-2xl font-bold text-white">Jogo não encontrado</h1>
          <p className="mt-2 text-slate-400">
            Você não possui este jogo sincronizado ou ele não existe na nossa base.
          </p>
          <div className="mt-6">
            <PrimaryButton onClick={() => navigate("/dashboard")}>
              Voltar ao Dashboard
            </PrimaryButton>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Hero Section with Header Image Background */}
      <div className="relative -mx-4 -mt-10 mb-8 h-[300px] overflow-hidden md:-mx-8 md:h-[400px]">
        <div className="absolute inset-0 bg-midnight-950/20" />
        <img
          src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appId}/library_hero.jpg`}
          alt={game.name}
          className="h-full w-full object-cover blur-sm opacity-50"
          onError={(e) => {
            e.currentTarget.src = `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appId}/header.jpg`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight-950 via-midnight-950/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
            <div className="mx-auto max-w-7xl flex items-end gap-6 text-white ">
                 <img
                    src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appId}/header.jpg`}
                    alt={game.name}
                    className="h-32 rounded-lg shadow-2xl border border-midnight-700 hidden md:block"
                />
                <div>
                     <h1 className="text-4xl md:text-6xl font-bold mb-2 text-shadow-lg">{game.name}</h1>
                     <div className="flex gap-4 text-sm font-medium">
                        <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30">
                            AppID: {game.appId}
                        </span>
                     </div>
                </div>
            </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
             <section className="rounded-shell border border-midnight-800/80 bg-midnight-900/60 p-6 shadow-soft">
                <h2 className="text-xl font-semibold text-white mb-4">Sobre o jogo</h2>
                <div className="text-slate-300 leading-relaxed text-sm space-y-4" dangerouslySetInnerHTML={{ __html: description || "Carregando..." }} />
             </section>

             <section className="rounded-shell border border-midnight-800/80 bg-midnight-900/60 p-6 shadow-soft">
                <h2 className="text-xl font-semibold text-white mb-4">Suas Estatísticas</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <StatBox label="Tempo Total" value={`${Math.round((userGameStat?.playtime || 0) / 60)}h`} />
                     <StatBox label="Últimas 2 semanas" value={`${Math.round((userGameStat?.playtime || 0) / 60)}h`} subtext="(Simulado)" />
                     <StatBox label="Conquistas" value={userGameStat?.achievements || 0} />
                     <StatBox label="Sessões" value="-" />
                </div>
             </section>
        </div>

        <aside className="space-y-6">
            <div className="rounded-shell border border-midnight-800/80 bg-midnight-900/60 p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-white mb-4">Ações</h3>
                <PrimaryButton className="w-full">
                    Buscar Grupo
                </PrimaryButton>
                <button className="mt-3 w-full rounded-xl border border-midnight-700 bg-midnight-800/50 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-midnight-800 hover:text-white transition">
                    Ver na Loja Steam
                </button>
            </div>
        </aside>

      </div>
    </AppLayout>
  );
}

function StatBox({ label, value, subtext }: { label: string; value: string | number; subtext?: string }) {
    return (
        <div className="bg-midnight-950/50 p-4 rounded-xl border border-midnight-800 text-center">
            <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">{label}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {subtext && <p className="text-[10px] text-slate-600 mt-1">{subtext}</p>}
        </div>
    )
}
