import { FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { AppLayout } from "../../components/layout/AppLayout";
import { GroupCard } from "../../components/groups/GroupCard";
import { PrimaryButton } from "../../components/ui/Buttons";
import { useAuth } from "../../hooks/useAuth";
import { useCreateGroup, useGetListGroups } from "../../services";

const inputClasses =
  "w-full rounded-2xl border border-midnight-800 bg-midnight-900/60 px-4 py-3 text-base text-slate-100 placeholder-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition";

export function DashboardPage() {
  const { user } = useAuth();
  const { groups, loading, error, refetch } = useGetListGroups();
  const {
    createGroup,
    loading: creating,
    error: createError,
  } = useCreateGroup();
  const [form, setForm] = useState({ name: "", nickname: "" });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await createGroup({
        name: form.name,
        nickname: form.nickname.toLowerCase(),
      });
      setForm({ name: "", nickname: "" });
      refetch();
    } catch {
      // handled by hook
    }
  };

  const totalGroups = groups.length;
  const totalAdmins = useMemo(
    () => groups.filter((group) => group.membershipRole === "ADMIN").length,
    [groups],
  );

  return (
    <AppLayout>
      <section className="rounded-shell border border-midnight-800/80 bg-gradient-to-br from-midnight-900/90 to-midnight-900/40 p-8 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.45em] text-slate-500">
              Bem-vindo,
            </p>
            <h1 className="text-4xl font-bold text-white">
              {user?.displayName}{" "}
              <span className="text-indigo-300">(@{user?.nickname})</span>
            </h1>
            <p className="mt-2 text-slate-400">
              Gerencie seus squads privados e desafie os amigos.
            </p>
          </div>
          <div className="flex gap-4">
            <StatCard label="Grupos ativos" value={totalGroups} />
            <StatCard label="Admin em" value={totalAdmins} />
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-shell border border-midnight-800/80 bg-midnight-900/60 p-6 shadow-soft">
        <h2 className="mb-4 text-xl font-semibold text-white">Meus Jogos</h2>
        {user?.gameStats && user.gameStats.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {user.gameStats.map((stat) => (
              <Link
                key={stat.game.appId}
                to={`/games/${stat.game.appId}`}
                className="group relative overflow-hidden rounded-xl border border-midnight-800 bg-midnight-900 transition hover:border-indigo-500/50"
              >
                <div className="aspect-[16/9] w-full overflow-hidden bg-midnight-800">
                    <img
                      src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${stat.game.appId}/header.jpg`}
                      alt={stat.game.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      onError={(e) => {
                         e.currentTarget.style.display = 'none'; 
                         e.currentTarget.parentElement!.innerHTML = '<div class="flex h-full items-center justify-center text-slate-600">No Image</div>';
                      }}
                    />
                </div>
                <div className="p-3">
                  <h3 className="truncate text-sm font-medium text-slate-200" title={stat.game.name}>
                    {stat.game.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {Math.round(stat.playtime / 60)}h jogadas
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-midnight-700 py-8 text-center">
            <p className="mb-2 text-slate-400">Nenhum jogo sincronizado.</p>
            <p className="text-sm text-slate-500">
              Vincule sua conta Steam no <a href="/profile" className="text-indigo-400 hover:underline">Perfil</a> para ver seus jogos aqui.
            </p>
          </div>
        )}
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">Meus grupos</h2>
              <p className="text-sm text-slate-400">
                Cards com status, quantidade de membros e seu papel.
              </p>
            </div>
          </header>

          {error && (
            <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-200">
              {error}
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            {groups.map((group) => (
              <GroupCard
                key={group.id}
                id={group.id}
                name={group.name}
                nickname={group.nickname}
                membersCount={group.membersCount ?? 0}
                membershipRole={group.membershipRole}
              />
            ))}
          </div>
          {!groups.length && !loading && (
            <div className="rounded-shell border border-dashed border-midnight-800/70 p-8 text-center text-slate-400">
              Você ainda não entrou em nenhum grupo.
            </div>
          )}
          {loading && (
            <div className="flex items-center gap-3 text-slate-400">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500/40 border-t-indigo-300" />
              Carregando grupos...
            </div>
          )}
        </div>

        <aside className="rounded-shell border border-midnight-800/80 bg-midnight-900/60 p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">
            Novo squad
          </p>
          <h3 className="mb-6 text-2xl font-semibold text-white">
            Crie um novo grupo
          </h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              className={inputClasses}
              placeholder="Nome do grupo"
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              required
            />
            <input
              className={inputClasses}
              placeholder="@nickname"
              value={form.nickname}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  nickname: event.target.value.toLowerCase(),
                }))
              }
              required
            />
            {createError && (
              <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">
                {createError}
              </div>
            )}
            <PrimaryButton type="submit" loading={creating}>
              {creating ? "Criando..." : "Criar grupo"}
            </PrimaryButton>
          </form>
        </aside>
      </section>
    </AppLayout>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-[150px] rounded-3xl border border-midnight-800 bg-midnight-900/60 px-5 py-4 text-center shadow-soft">
      <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
        {label}
      </p>
      <p className="text-3xl font-bold text-indigo-200">{value}</p>
    </div>
  );
}
