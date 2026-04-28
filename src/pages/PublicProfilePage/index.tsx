import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getApiErrorMessage, socialApi, userApi } from "../../api/client";
import { PublicUserProfile } from "../../api/types";
import { AppLayout } from "../../components/layout/AppLayout";
import { PrimaryButton, SecondaryButton } from "../../components/ui/Buttons";

const cardClasses =
  "rounded-shell border border-midnight-800/80 bg-midnight-900/60 p-6 shadow-soft";

function formatHours(minutes: number) {
  return `${Math.round(minutes / 60)}h`;
}

function friendshipCtaLabel(status: PublicUserProfile["friendshipStatus"]) {
  if (status === "SELF") return "Este é você";
  if (status === "FRIENDS") return "Amigos";
  if (status === "PENDING_SENT") return "Solicitação enviada";
  if (status === "PENDING_RECEIVED") return "Solicitação recebida";
  return "Adicionar amigo";
}

function canSendRequest(status: PublicUserProfile["friendshipStatus"]) {
  return status === "NONE";
}

export function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingRequest, setSendingRequest] = useState(false);

  const steamStoreUrl = useMemo(
    () =>
      profile?.topGames?.[0]
        ? `https://store.steampowered.com/app/${profile.topGames[0].game.appId}`
        : "",
    [profile],
  );

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const data = await userApi.getPublicProfile(id);
        setProfile(data);
      } catch (err: unknown) {
        const message = getApiErrorMessage(
          err,
          "Não foi possível carregar o perfil.",
        );
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleAddFriend = async () => {
    if (!profile || !canSendRequest(profile.friendshipStatus)) return;

    setSendingRequest(true);
    setError(null);
    try {
      await socialApi.sendFriendRequest(profile.nickname);
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              friendshipStatus: "PENDING_SENT",
            }
          : prev,
      );
    } catch (err: unknown) {
      const message = getApiErrorMessage(err, "Falha ao enviar solicitação.");
      setError(message);
    } finally {
      setSendingRequest(false);
    }
  };

  return (
    <AppLayout>
      {loading && (
        <div className="rounded-shell border border-midnight-800/70 p-8 text-center text-slate-400">
          <span className="mr-3 inline-block h-5 w-5 animate-spin rounded-full border-2 border-indigo-500/40 border-t-indigo-300" />
          Carregando perfil...
        </div>
      )}

      {error && (
        <div className="rounded-3xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {!loading && profile && (
        <>
          <section className="rounded-shell border border-midnight-800/80 bg-gradient-to-br from-midnight-900/90 to-midnight-900/40 p-8 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 overflow-hidden rounded-3xl border border-midnight-700 bg-midnight-900">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white">
                      {profile.displayName[0]}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                    Perfil público
                  </p>
                  <h1 className="text-3xl font-bold text-white">
                    {profile.displayName}
                  </h1>
                  <p className="text-slate-400">@{profile.nickname}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <SecondaryButton onClick={() => navigate("/social/friends")}>
                  Voltar para amigos
                </SecondaryButton>
                {profile.steamProfileUrl && (
                  <a
                    href={profile.steamProfileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-midnight-700 bg-midnight-900/40 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-indigo-400/70 hover:text-white"
                  >
                    Ver perfil Steam
                  </a>
                )}
                <PrimaryButton
                  loading={sendingRequest}
                  disabled={!canSendRequest(profile.friendshipStatus)}
                  onClick={handleAddFriend}
                >
                  {friendshipCtaLabel(profile.friendshipStatus)}
                </PrimaryButton>
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <aside className={cardClasses}>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                Estatísticas
              </p>
              <div className="mt-4 grid gap-3">
                <div className="rounded-2xl border border-midnight-800/70 bg-midnight-950/40 p-4">
                  <p className="text-xs text-slate-500">Jogos sincronizados</p>
                  <p className="text-2xl font-bold text-white">
                    {profile.stats.totalGames}
                  </p>
                </div>
                <div className="rounded-2xl border border-midnight-800/70 bg-midnight-950/40 p-4">
                  <p className="text-xs text-slate-500">Tempo total jogado</p>
                  <p className="text-2xl font-bold text-white">
                    {formatHours(profile.stats.totalPlaytime)}
                  </p>
                </div>
                <div className="rounded-2xl border border-midnight-800/70 bg-midnight-950/40 p-4">
                  <p className="text-xs text-slate-500">Conquistas totais</p>
                  <p className="text-2xl font-bold text-white">
                    {profile.stats.totalAchievements}
                  </p>
                </div>
              </div>
            </aside>

            <div className={cardClasses}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                    Top jogos
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-white">
                    Jogos mais jogados
                  </h2>
                </div>
                {steamStoreUrl && (
                  <a
                    href={steamStoreUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-indigo-300 hover:text-indigo-200"
                  >
                    Ver destaque na Steam
                  </a>
                )}
              </div>

              {profile.topGames.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-dashed border-midnight-800/70 p-6 text-sm text-slate-400">
                  Sem jogos sincronizados no perfil.
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {profile.topGames.map((entry) => (
                    <button
                      key={entry.game.appId}
                      type="button"
                      onClick={() => navigate(`/games/${entry.game.appId}`)}
                      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-midnight-800/70 bg-midnight-950/40 p-4 text-left transition hover:border-indigo-400/70"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-white">
                          {entry.game.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatHours(entry.playtime)} totais •{" "}
                          {entry.achievements} conquistas
                        </p>
                      </div>
                      <div className="rounded-xl bg-indigo-500/10 px-3 py-2 text-xs font-semibold text-indigo-200">
                        AppID {entry.game.appId}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </AppLayout>
  );
}
