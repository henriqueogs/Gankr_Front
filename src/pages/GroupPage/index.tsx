import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { AppLayout } from "../../components/layout/AppLayout";
import { MemberRow } from "../../components/groups/MemberRow";
import { GroupPostCard } from "../../components/groups/GroupPostCard";
import { ChampionshipCard } from "../../components/championships/ChampionshipCard";
import { GroupStats } from "../../components/groups/GroupStats";
import { PrimaryButton, SecondaryButton } from "../../components/ui/Buttons";
import { useAuth } from "../../hooks/useAuth";
import {
  useAddGroupMember,
  useChampionships,
  useGetGroupDetail,
  useGroupStats,
  useRemoveGroupMember,
} from "../../services";
import { useGroupPosts } from "../../services/useGroupPosts";
import { socialApi } from "../../api/client";
import { AuthenticatedUser } from "../../api/types";

const inputField =
  "w-full rounded-2xl border border-midnight-800 bg-midnight-900/60 px-4 py-3 text-base text-slate-100 placeholder-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition";

export function GroupPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { group, loading, error, refetch } = useGetGroupDetail(id ?? "");
  const {
    posts,
    loading: postsLoading,
    error: postsError,
    createPost,
    deletePost,
    refetch: refetchPosts,
  } = useGroupPosts(id ?? "");
  const {
    championships,
    loading: championshipsLoading,
    error: championshipsError,
    refetch: refetchChampionships,
  } = useChampionships(id ?? "");
  const {
    stats: groupStats,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useGroupStats(id ?? "");
  const {
    addMember,
    loading: addingMember,
    error: addError,
  } = useAddGroupMember();
  const {
    removeMember,
    loading: removingMember,
    error: removeError,
  } = useRemoveGroupMember();
  const [memberHandle, setMemberHandle] = useState("");
  const [activeTab, setActiveTab] = useState<
    "overview" | "championships" | "feed" | "stats"
  >("overview");
  const [postContent, setPostContent] = useState("");
  const [postSubmitting, setPostSubmitting] = useState(false);
  const [championshipStatus, setChampionshipStatus] = useState<
    "ALL" | "ACTIVE" | "FINISHED" | "DRAFT"
  >("ALL");

  // Requests State
  const [requests, setRequests] = useState<
    { id: string; user: AuthenticatedUser }[]
  >([]);

  // Fetch requests when owner/admin is confirmed
  useEffect(() => {
    const fetchRequests = async () => {
      if (
        id &&
        (group?.membershipRole === "ADMIN" || user?.id === group?.ownerId)
      ) {
        try {
          const data = await socialApi.getGroupRequests(id);
          setRequests(data);
        } catch (e) {
          console.error("Failed to fetch requests", e);
        }
      }
    };
    fetchRequests();
  }, [id, group, user]);

  const handleRespondRequest = async (
    requestId: string,
    status: "APPROVED" | "REJECTED",
  ) => {
    try {
      await socialApi.respondGroupRequest(requestId, status);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
      refetch(); // Refresh group members if approved
    } catch (e) {
      console.error(`Failed to ${status} request`, e);
    }
  };

  const owner = useMemo(
    () => group?.members.find((member) => member.id === group.ownerId),
    [group],
  );

  const isAdmin =
    group?.membershipRole === "ADMIN" || user?.id === group?.ownerId;

  const recentPosts = useMemo(() => posts.slice(0, 5), [posts]);
  const filteredChampionships = useMemo(() => {
    if (championshipStatus === "ALL") return championships;
    return championships.filter((championship) =>
      championshipStatus === "ACTIVE"
        ? championship.status === "ACTIVE"
        : championshipStatus === "FINISHED"
          ? championship.status === "FINISHED"
          : championship.status === "DRAFT",
    );
  }, [championships, championshipStatus]);

  const championshipCounts = useMemo(
    () => ({
      ALL: championships.length,
      ACTIVE: championships.filter((item) => item.status === "ACTIVE").length,
      FINISHED: championships.filter((item) => item.status === "FINISHED")
        .length,
      DRAFT: championships.filter((item) => item.status === "DRAFT").length,
    }),
    [championships],
  );

  const handleAddMember = async (event: FormEvent) => {
    event.preventDefault();
    if (!memberHandle.trim() || !id) return;

    try {
      await addMember(id, memberHandle);
      setMemberHandle("");
      refetch();
    } catch {
      // handled by hooks
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!id) return;

    try {
      await removeMember(id, memberId);
      refetch();
    } catch {
      // handled by hooks
    }
  };

  const handleCreatePost = async (event: FormEvent) => {
    event.preventDefault();
    if (!postContent.trim()) return;

    try {
      setPostSubmitting(true);
      await createPost(postContent.trim());
      setPostContent("");
    } catch {
      // handled by hooks
    } finally {
      setPostSubmitting(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId);
    } catch {
      // handled by hooks
    }
  };

  return (
    <AppLayout>
      {loading && (
        <div className="rounded-shell border border-midnight-800/70 p-8 text-center text-slate-400">
          <span className="mr-3 inline-block h-5 w-5 animate-spin rounded-full border-2 border-indigo-500/40 border-t-indigo-300" />
          Carregando grupo...
        </div>
      )}

      {error && (
        <div className="rounded-3xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}
      {addError && (
        <div className="rounded-3xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-200">
          {addError}
        </div>
      )}
      {removeError && (
        <div className="rounded-3xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-200">
          {removeError}
        </div>
      )}

      {!loading && group && (
        <>
          <section className="rounded-shell border border-midnight-800/80 bg-gradient-to-br from-midnight-900/80 to-midnight-900/30 p-8 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                  Grupo
                </p>
                <h1 className="text-4xl font-bold text-white">{group.name}</h1>
                <p className="text-slate-400">@{group.nickname}</p>
              </div>
              <div className="flex gap-3">
                <SecondaryButton onClick={() => navigate("/dashboard")}>
                  Voltar
                </SecondaryButton>
                <SecondaryButton onClick={refetch}>Atualizar</SecondaryButton>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-6 rounded-3xl border border-midnight-800/70 bg-midnight-900/40 p-5">
              {owner && (
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 overflow-hidden rounded-2xl bg-indigo-500/30 text-center text-base font-semibold text-white">
                    {owner.avatarUrl ? (
                      <img
                        src={owner.avatarUrl}
                        alt={owner.displayName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      owner.displayName.charAt(0)
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Líder</p>
                    <p className="text-lg font-semibold text-white">
                      {owner.displayName}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex gap-4 text-sm text-slate-300">
                <span>👥 {group.members.length} membros</span>
                <span>Seu papel: {group.membershipRole}</span>
              </div>
            </div>
          </section>

          <section className="rounded-shell border border-midnight-800/70 bg-midnight-900/40 p-3 shadow-soft">
            <div className="flex flex-wrap items-center gap-3">
              {[
                { key: "overview", label: "Visão Geral" },
                { key: "championships", label: "Campeonatos" },
                { key: "feed", label: "Feed" },
                { key: "stats", label: "Estatísticas" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() =>
                    setActiveTab(
                      tab.key as
                        | "overview"
                        | "championships"
                        | "feed"
                        | "stats",
                    )
                  }
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeTab === tab.key
                      ? "bg-indigo-500/30 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </section>

          {activeTab === "overview" && (
            <>
              <section className="space-y-4 rounded-shell border border-midnight-800/80 bg-midnight-900/40 p-6 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">
                      Membros
                    </h2>
                    <p className="text-sm text-slate-400">
                      Avatares destacados e papéis claros.
                    </p>
                  </div>
                  <p className="text-sm text-slate-400">
                    {group.members.length} jogadores
                  </p>
                </div>
                <div className="space-y-3">
                  {group.members.map((member) => (
                    <MemberRow
                      key={member.id}
                      displayName={member.displayName}
                      nickname={member.nickname}
                      role={member.role}
                      avatarUrl={member.avatarUrl}
                      isOwner={member.id === group.ownerId}
                      canRemove={isAdmin && member.id !== group.ownerId}
                      removing={removingMember}
                      onRemove={() => handleRemoveMember(member.id)}
                    />
                  ))}
                </div>
              </section>

              <section className="rounded-shell border border-midnight-800/80 bg-midnight-900/40 p-6 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">
                      Posts recentes
                    </h2>
                    <p className="text-sm text-slate-400">
                      Últimas atualizações do grupo.
                    </p>
                  </div>
                  <p className="text-xs text-slate-500">Últimos 5</p>
                </div>
                <div className="mt-4 space-y-3">
                  {postsLoading && (
                    <p className="text-sm text-slate-400">
                      Carregando posts...
                    </p>
                  )}
                  {postsError && (
                    <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-3 text-xs text-red-200">
                      {postsError}
                    </div>
                  )}
                  {!postsLoading && !postsError && recentPosts.length === 0 && (
                    <p className="text-sm text-slate-500">Sem posts ainda.</p>
                  )}
                  {recentPosts.map((post) => (
                    <GroupPostCard
                      key={post.id}
                      author={post.author}
                      content={post.content}
                      createdAt={post.createdAt}
                    />
                  ))}
                </div>
              </section>

              <section className="rounded-shell border border-midnight-800/80 bg-midnight-900/40 p-6 shadow-soft">
                <GroupStats
                  stats={groupStats}
                  loading={statsLoading}
                  error={statsError}
                  onRefresh={refetchStats}
                  variant="compact"
                />
              </section>

              {isAdmin && (
                <section className="rounded-shell border border-midnight-800/80 bg-midnight-900/60 p-6 shadow-soft">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-white">
                      Adicionar membro
                    </h3>
                    <p className="text-sm text-slate-400">
                      Convide por nickname e mantenha seu squad fechado.
                    </p>
                  </div>
                  <form
                    className="flex flex-col gap-3 md:flex-row"
                    onSubmit={handleAddMember}
                  >
                    <input
                      className={inputField}
                      placeholder="nickname do jogador"
                      value={memberHandle}
                      onChange={(event) =>
                        setMemberHandle(event.target.value.toLowerCase())
                      }
                      required
                    />
                    <PrimaryButton type="submit" loading={addingMember}>
                      {addingMember ? "Adicionando..." : "Adicionar ao grupo"}
                    </PrimaryButton>
                  </form>
                </section>
              )}

              {isAdmin && requests.length > 0 && (
                <section className="space-y-4 rounded-shell border border-midnight-800/80 bg-midnight-900/40 p-6 shadow-soft">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-semibold text-white">
                      Solicitações Pendentes
                    </h2>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white">
                      {requests.length}
                    </span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {requests.map((req) => (
                      <div
                        key={req.id}
                        className="flex items-center justify-between rounded-xl border border-midnight-800 bg-midnight-900/60 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-700">
                            {req.user.avatarUrl ? (
                              <img
                                src={req.user.avatarUrl}
                                alt={req.user.nickname}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
                                {req.user.displayName[0]}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {req.user.displayName}
                            </p>
                            <p className="text-xs text-slate-400">
                              @{req.user.nickname}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleRespondRequest(req.id, "APPROVED")
                            }
                            className="rounded-lg bg-emerald-500/20 p-2 text-emerald-400 hover:bg-emerald-500/30 transition"
                            title="Aprovar"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() =>
                              handleRespondRequest(req.id, "REJECTED")
                            }
                            className="rounded-lg bg-red-500/20 p-2 text-red-400 hover:bg-red-500/30 transition"
                            title="Rejeitar"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {activeTab === "championships" && (
            <section className="rounded-shell border border-midnight-800/80 bg-midnight-900/40 p-6 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    Campeonatos
                  </h2>
                  <p className="text-sm text-slate-400">
                    Acompanhe o desempenho do grupo em eventos ativos.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <SecondaryButton onClick={refetchChampionships}>
                    Atualizar
                  </SecondaryButton>
                  {isAdmin ? (
                    <PrimaryButton
                      onClick={() =>
                        navigate(`/social/groups/${group.id}/championships/new`)
                      }
                    >
                      Criar campeonato
                    </PrimaryButton>
                  ) : (
                    <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs text-indigo-200">
                      Somente admins
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {(
                  [
                    { key: "ALL", label: "Todos" },
                    { key: "ACTIVE", label: "Ativos" },
                    { key: "FINISHED", label: "Finalizados" },
                    { key: "DRAFT", label: "Rascunhos" },
                  ] as const
                ).map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setChampionshipStatus(filter.key)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition ${
                      championshipStatus === filter.key
                        ? "bg-indigo-500/30 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {filter.label} ({championshipCounts[filter.key]})
                  </button>
                ))}
              </div>

              <div className="mt-6">
                {championshipsLoading && (
                  <p className="text-sm text-slate-400">
                    Carregando campeonatos...
                  </p>
                )}
                {championshipsError && (
                  <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-3 text-xs text-red-200">
                    {championshipsError}
                  </div>
                )}
                {!championshipsLoading &&
                  !championshipsError &&
                  filteredChampionships.length === 0 && (
                    <div className="rounded-2xl border border-midnight-800/70 bg-midnight-900/50 p-4 text-sm text-slate-400">
                      Nenhum campeonato encontrado para este filtro.
                    </div>
                  )}
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {filteredChampionships.map((championship) => (
                    <ChampionshipCard
                      key={championship.id}
                      id={championship.id}
                      name={championship.name}
                      metric={championship.metric}
                      status={championship.status}
                      startDate={championship.startDate}
                      endDate={championship.endDate}
                      game={{
                        appId: championship.game.appId,
                        name: championship.game.name,
                      }}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeTab === "feed" && (
            <section className="rounded-shell border border-midnight-800/80 bg-midnight-900/40 p-6 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Feed</h2>
                  <p className="text-sm text-slate-400">
                    Compartilhe atualizações e novidades do grupo.
                  </p>
                </div>
                <SecondaryButton onClick={refetchPosts}>
                  Atualizar
                </SecondaryButton>
              </div>
              {posts.map((post) => (
                <GroupPostCard
                  key={post.id}
                  author={post.author}
                  content={post.content}
                  createdAt={post.createdAt}
                  canDelete={isAdmin || post.author.id === user?.id}
                  onDelete={() => handleDeletePost(post.id)}
                />
              ))}
              <form
                onSubmit={handleCreatePost}
                className="mt-6 rounded-3xl border border-midnight-800/70 bg-midnight-900/60 p-4"
              >
                <label className="text-xs uppercase tracking-[0.35em] text-slate-500">
                  Novo post
                </label>
                <textarea
                  className={`${inputField} mt-3 min-h-[120px] resize-y`}
                  placeholder="Compartilhe algo com o grupo..."
                  value={postContent}
                  maxLength={2000}
                  onChange={(event) => setPostContent(event.target.value)}
                  required
                />
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">
                    {postContent.length}/2000
                  </span>
                  <PrimaryButton type="submit" loading={postSubmitting}>
                    {postSubmitting ? "Publicando..." : "Publicar"}
                  </PrimaryButton>
                </div>
              </form>

              <div className="mt-6 space-y-3">
                {postsLoading && (
                  <p className="text-sm text-slate-400">Carregando posts...</p>
                )}
                {postsError && (
                  <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-3 text-xs text-red-200">
                    {postsError}
                  </div>
                )}
                {!postsLoading && !postsError && posts.length === 0 && (
                  <div className="rounded-2xl border border-midnight-800/70 bg-midnight-900/50 p-4 text-sm text-slate-400">
                    Nenhum post ainda. Seja o primeiro a escrever.
                  </div>
                )}
              </div>
            </section>
          )}

          {activeTab === "stats" && (
            <section className="rounded-shell border border-midnight-800/80 bg-midnight-900/40 p-6 shadow-soft">
              <GroupStats
                stats={groupStats}
                loading={statsLoading}
                error={statsError}
                onRefresh={refetchStats}
                variant="full"
              />
            </section>
          )}
        </>
      )}

      {!loading && !group && (
        <div className="rounded-shell border border-midnight-800/70 p-8 text-center">
          <p className="text-slate-400">Grupo não encontrado.</p>
          <PrimaryButton
            className="mt-4"
            onClick={() => navigate("/dashboard")}
          >
            Voltar ao dashboard
          </PrimaryButton>
        </div>
      )}
    </AppLayout>
  );
}
