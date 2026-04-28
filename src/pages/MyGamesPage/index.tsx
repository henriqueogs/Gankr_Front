import { Link } from "react-router-dom";
import { AppLayout } from "../../components/layout/AppLayout";
import { useAuth } from "../../hooks/useAuth";
import { PrimaryButton } from "../../components/ui/Buttons";
import { useNavigate } from "react-router-dom";

export function MyGamesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <AppLayout>
      <section className="rounded-shell border border-midnight-800/80 bg-gradient-to-br from-midnight-900/90 to-midnight-900/40 p-8 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white">Meus Jogos</h1>
            <p className="mt-2 text-slate-400">
              Gerencie sua biblioteca e veja suas estatísticas detalhadas.
            </p>
          </div>
          <PrimaryButton onClick={() => navigate("/profile")}>
            Sincronizar Steam
          </PrimaryButton>
        </div>
      </section>

      <section className="mt-8">
        {user?.gameStats && user.gameStats.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {user.gameStats.map((stat) => (
              <Link
                key={stat.game.appId}
                to={`/games/${stat.game.appId}`}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-midnight-800 bg-midnight-900 transition hover:border-indigo-500/50 hover:shadow-glow-indigo"
              >
                <div className="aspect-[16/9] w-full overflow-hidden bg-midnight-800 relative">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition z-10"/>
                    <img
                      src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${stat.game.appId}/header.jpg`}
                      alt={stat.game.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          // Fallback to Icon URL if header fails (common for non-store apps)
                          if (stat.game.logoUrl && !target.src.includes('public/images/apps')) {
                              target.src = `http://media.steampowered.com/steamcommunity/public/images/apps/${stat.game.appId}/${stat.game.logoUrl}.jpg`;
                          } else {
                             target.style.display = 'none';
                             target.parentElement!.classList.add('flex', 'items-center', 'justify-center');
                             target.parentElement!.innerHTML = '<div class="text-slate-600 text-sm">No Image</div>';
                          }
                      }}
                    />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="mb-1 truncate text-base font-semibold text-slate-200 group-hover:text-white" title={stat.game.name}>
                    {stat.game.name}
                  </h3>
                  <div className="mt-auto flex items-center justify-between text-xs text-slate-500">
                    <span>{Math.round(stat.playtime / 60)}h totais</span>
                  </div>
                    {stat.playtime2weeks > 0 && (
                        <div className="mt-2 inline-flex items-center text-xs text-emerald-400">
                            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-glow-green" />
                            {Math.round(stat.playtime2weeks / 60)}h nas últimas 2 sem.
                        </div>
                    )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-shell border border-dashed border-midnight-700 py-16 text-center">
            <div className="mb-4 rounded-full bg-midnight-800 p-4">
                <span className="text-4xl">🎮</span>
            </div>
            <h3 className="text-xl font-semibold text-white">Nenhum jogo encontrado</h3>
            <p className="mt-2 max-w-sm text-slate-400">
              Parece que você ainda não sincronizou sua biblioteca da Steam.
            </p>
            <div className="mt-6">
                 <PrimaryButton onClick={() => navigate("/profile")}>
                    Vincular conta Steam
                </PrimaryButton>
            </div>
          </div>
        )}
      </section>
    </AppLayout>
  );
}
