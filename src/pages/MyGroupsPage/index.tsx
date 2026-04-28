import { FormEvent, useState } from "react";
import { AppLayout } from "../../components/layout/AppLayout";
import { useCreateGroup, useGetListGroups } from "../../services";
import { socialApi } from "../../api/client";
import { GroupCard } from "../../components/groups/GroupCard";
import { PrimaryButton } from "../../components/ui/Buttons";

const inputClasses =
  "w-full rounded-2xl border border-midnight-800 bg-midnight-900/60 px-4 py-3 text-base text-slate-100 placeholder-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition";

export function MyGroupsPage() {
  const { groups, loading, error, refetch } = useGetListGroups();
  const {
    createGroup,
    loading: creating,
    error: createError,
  } = useCreateGroup();
  const [form, setForm] = useState({ name: "", nickname: "" });
  
  // Join Group State
  const [joinCode, setJoinCode] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinMsg, setJoinMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleJoin = async (e: FormEvent) => {
    e.preventDefault();
    setJoinLoading(true);
    setJoinMsg(null);
    try {
        await socialApi.joinGroup(joinCode);
        setJoinMsg({ type: 'success', text: 'Solicitação enviada com sucesso! O admin irá analisar.' });
        setJoinCode("");
    } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const error = err as any;
        setJoinMsg({ type: 'error', text: error.response?.data?.message || 'Falha ao entrar no grupo.' });
    } finally {
        setJoinLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await createGroup({
        name: form.name,
        nickname: form.nickname.toLowerCase(),
      });
      setForm({ name: "", nickname: "" });
      refetch();
      setForm({ name: "", nickname: "" });
      refetch();
      refetch();
    } catch (err) {
       // handled by hook
       console.error(err);
    }
  };

  return (
    <AppLayout>
      <section className="rounded-shell border border-midnight-800/80 bg-gradient-to-br from-midnight-900/90 to-midnight-900/40 p-8 shadow-soft">
        <h1 className="text-4xl font-bold text-white">Meus Grupos</h1>
        <p className="mt-2 text-slate-400">
          Gerencie seus squads, crie novos grupos e convide amigos.
        </p>
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <header>
            <h2 className="text-xl font-semibold text-white">Seus Squads</h2>
          </header>

          {error && (
            <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-200">
              {error}
            </div>
          )}
          
          <div className="grid gap-4 md:grid-cols-2">
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

        <aside className="space-y-6">
            <div className="rounded-shell border border-midnight-800/80 bg-midnight-900/60 p-6 shadow-soft">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">
                    Entrar em Squad
                </p>
                <h3 className="mb-4 text-xl font-semibold text-white">
                    Tem um código?
                </h3>
                <form onSubmit={handleJoin} className="space-y-4">
                    <input
                        className={inputClasses}
                        placeholder="Código ou @nickname do grupo"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        required
                    />
                    {joinMsg && (
                        <div className={`text-sm p-3 rounded-xl ${joinMsg.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                            {joinMsg.text}
                        </div>
                    )}
                    <PrimaryButton type="submit" loading={joinLoading}>
                        {joinLoading ? "Enviando..." : "Solicitar Entrada"}
                    </PrimaryButton>
                </form>
            </div>

            <div className="rounded-shell border border-midnight-800/80 bg-midnight-900/60 p-6 shadow-soft">
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
            </div>
        </aside>
      </section>
    </AppLayout>
  );
}
