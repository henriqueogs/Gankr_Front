import { FormEvent, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { AppLayout } from "../../components/layout/AppLayout";
import { PrimaryButton, SecondaryButton } from "../../components/ui/Buttons";
import { useAuth } from "../../hooks/useAuth";
import { useGetGroupDetail, useGroupStats } from "../../services";
import { api, getApiErrorMessage } from "../../api/client";

const inputField =
  "w-full rounded-2xl border border-midnight-800 bg-midnight-900/60 px-4 py-3 text-base text-slate-100 placeholder-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition";

export function CreateChampionshipPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { group } = useGetGroupDetail(id ?? "");
  const { stats, loading, error, refetch } = useGroupStats(id ?? "");

  const [form, setForm] = useState({
    name: "",
    gameId: "",
    metric: "PLAYTIME_DELTA",
    startDate: "",
    endDate: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isAdmin = useMemo(
    () => group?.membershipRole === "ADMIN" || user?.id === group?.ownerId,
    [group, user],
  );

  const games = stats?.games ?? [];

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!id) return;

    setSubmitError(null);

    try {
      setSubmitting(true);
      const payload = {
        name: form.name,
        gameId: form.gameId,
        metric: form.metric,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
      };

      const response = await api.post(`/groups/${id}/championships`, payload);
      navigate(`/championships/${response.data.id}`);
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, "Falha ao criar campeonato");
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!group) {
    return (
      <AppLayout>
        <div className="rounded-shell border border-midnight-800/70 p-8 text-center">
          <p className="text-slate-400">Grupo não encontrado.</p>
          <PrimaryButton
            className="mt-4"
            onClick={() => navigate("/dashboard")}
          >
            Voltar ao dashboard
          </PrimaryButton>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <section className="rounded-shell border border-midnight-800/80 bg-gradient-to-br from-midnight-900/90 to-midnight-900/40 p-8 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
              Novo Campeonato
            </p>
            <h1 className="text-3xl font-bold text-white">{group.name}</h1>
            <p className="text-slate-400">@{group.nickname}</p>
          </div>
          <SecondaryButton
            onClick={() => navigate(`/social/groups/${group.id}`)}
          >
            Voltar ao grupo
          </SecondaryButton>
        </div>
      </section>

      {!isAdmin && (
        <div className="mt-6 rounded-3xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-200">
          Apenas administradores podem criar campeonatos.
        </div>
      )}

      <section className="mt-6 rounded-shell border border-midnight-800/80 bg-midnight-900/60 p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-white">Configuração</h2>
            <p className="text-sm text-slate-400">
              Defina o jogo, métrica e período.
            </p>
          </div>
          <SecondaryButton onClick={refetch}>Atualizar jogos</SecondaryButton>
        </div>

        {loading && (
          <p className="mt-4 text-sm text-slate-400">
            Carregando jogos do grupo...
          </p>
        )}
        {error && (
          <div className="mt-4 rounded-2xl border border-red-400/40 bg-red-500/10 p-3 text-xs text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            className={inputField}
            placeholder="Nome do campeonato"
            value={form.name}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, name: event.target.value }))
            }
            required
          />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-[0.35em] text-slate-500">
                Jogo
              </label>
              <select
                className={`${inputField} mt-2`}
                value={form.gameId}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, gameId: event.target.value }))
                }
                required
                disabled={!isAdmin || games.length === 0}
              >
                <option value="">Selecione um jogo</option>
                {games.map((item) => (
                  <option key={item.game.appId} value={item.game.appId}>
                    {item.game.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.35em] text-slate-500">
                Métrica
              </label>
              <select
                className={`${inputField} mt-2`}
                value={form.metric}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, metric: event.target.value }))
                }
                required
                disabled={!isAdmin}
              >
                <option value="PLAYTIME_DELTA">Tempo ganho no período</option>
                <option value="ACHIEVEMENTS_DELTA">Conquistas ganhas no período</option>
                <option value="PLAYTIME_2WEEKS">Tempo nas últimas 2 semanas (Steam)</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-[0.35em] text-slate-500">
                Início
              </label>
              <input
                className={`${inputField} mt-2`}
                type="datetime-local"
                value={form.startDate}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    startDate: event.target.value,
                  }))
                }
                required
                disabled={!isAdmin}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.35em] text-slate-500">
                Fim
              </label>
              <input
                className={`${inputField} mt-2`}
                type="datetime-local"
                value={form.endDate}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, endDate: event.target.value }))
                }
                required
                disabled={!isAdmin}
              />
            </div>
          </div>

          {submitError && (
            <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">
              {submitError}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <PrimaryButton
              type="submit"
              loading={submitting}
              disabled={!isAdmin}
            >
              {submitting ? "Criando..." : "Criar campeonato"}
            </PrimaryButton>
            <SecondaryButton
              onClick={() => navigate(`/social/groups/${group.id}`)}
            >
              Cancelar
            </SecondaryButton>
          </div>
        </form>
      </section>
    </AppLayout>
  );
}
