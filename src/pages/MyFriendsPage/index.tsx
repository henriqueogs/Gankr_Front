import { useState, FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppLayout } from "../../components/layout/AppLayout";
import { socialApi, userApi } from "../../api/client";
import {
  AuthenticatedUser,
  PendingFriendRequest,
  UserSearchResult,
} from "../../api/types";
import { PrimaryButton, SecondaryButton } from "../../components/ui/Buttons";

function getErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }

  return fallback;
}

export function MyFriendsPage() {
  const navigate = useNavigate();
  const [friends, setFriends] = useState<AuthenticatedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState<PendingFriendRequest[]>(
    [],
  );
  const [searchNickname, setSearchNickname] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const acceptedFriendsCount = friends.length;

  const fetchFriends = async () => {
    try {
      const [friendsData, requestsData] = await Promise.all([
        socialApi.listFriends(),
        socialApi.listPendingFriendRequests(),
      ]);
      setFriends(friendsData);
      setPendingRequests(requestsData);
    } catch (error) {
      console.error("Failed to fetch friends", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (requestId: string, status: 'ACCEPTED' | 'REJECTED') => {
      try {
          await socialApi.respondFriendRequest(requestId, status);
          fetchFriends();
      } catch (err) {
          console.error("Failed to respond", err);
      }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const incomingRequests = pendingRequests.filter(
    (request) => request.direction === "INCOMING",
  );
  const outgoingRequests = pendingRequests.filter(
    (request) => request.direction === "OUTGOING",
  );

  const handleAddFriend = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchNickname.trim()) return;
    
    setSending(true);
    setMsg(null);
    try {
      await socialApi.sendFriendRequest(searchNickname);
      setMsg({ type: 'success', text: `Solicitação enviada para @${searchNickname}!` });
      await fetchFriends();
      setSearchNickname("");
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any;
      setMsg({ type: 'error', text: error.response?.data?.message || "Falha ao enviar solicitação." });
    } finally {
      setSending(false);
    }
  };

  const handleSearchUsers = async (event: FormEvent) => {
    event.preventDefault();
    if (!searchNickname.trim()) return;

    setSearching(true);
    setMsg(null);
    try {
      const users = await userApi.searchByNickname(searchNickname.trim());
      setSearchResults(users);
      if (!users.length) {
        setMsg({ type: "error", text: "Nenhum usuário encontrado para essa busca." });
      }
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Falha ao buscar usuários.");
      setMsg({ type: "error", text: message });
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSendRequestForUser = async (user: UserSearchResult) => {
    setSending(true);
    setMsg(null);
    try {
      await socialApi.sendFriendRequest(user.nickname);
      setMsg({ type: "success", text: `Solicitação enviada para @${user.nickname}!` });
      setSearchResults((prev) =>
        prev.map((entry) =>
          entry.id === user.id
            ? { ...entry, friendshipStatus: "PENDING_SENT" }
            : entry,
        ),
      );
      await fetchFriends();
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Falha ao enviar solicitação.");
      setMsg({ type: "error", text: message });
    } finally {
      setSending(false);
    }
  };

  return (
    <AppLayout>
      <section className="rounded-shell border border-midnight-800/80 bg-gradient-to-br from-midnight-900/90 to-midnight-900/40 p-8 shadow-soft">
        <h1 className="text-4xl font-bold text-white">Meus Amigos</h1>
        <p className="mt-2 text-slate-400">
          Acompanhe o que seus amigos estão jogando e convide-os para partidas.
        </p>
      </section>

      <section className="mt-8 rounded-shell border border-midnight-800/80 bg-midnight-900/60 p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">
            Adicionar
          </p>
          <h3 className="mb-6 text-2xl font-semibold text-white">
            Buscar Amigos
          </h3>
          <form
            onSubmit={handleSearchUsers}
            className="grid gap-3 md:grid-cols-[1fr_auto]"
          >
            <input
              className="w-full rounded-2xl border border-midnight-800 bg-midnight-900/60 px-4 py-3 text-base text-slate-100 placeholder-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
              placeholder="Buscar por @nickname"
              value={searchNickname}
              onChange={e => setSearchNickname(e.target.value)}
              required
            />
            <PrimaryButton type="submit" loading={searching}>
              {searching ? "Buscando..." : "Buscar Usuários"}
            </PrimaryButton>
          </form>
             {msg && (
                <div className={`text-sm p-3 rounded-xl ${msg.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {msg.text}
                </div>
            )}

          {searchResults.length > 0 && (
            <div className="mt-5 space-y-3">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="rounded-2xl border border-midnight-800/70 bg-midnight-950/40 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-700">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.displayName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
                          {user.displayName[0]}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <ProfileIdentityLink
                        userId={user.id}
                        displayName={user.displayName}
                        nickname={user.nickname}
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <SecondaryButton
                      className="px-3 py-2 text-xs"
                      onClick={() => navigate(`/users/${user.id}`)}
                    >
                      Ver perfil
                    </SecondaryButton>
                    <PrimaryButton
                      className="px-3 py-2 text-xs"
                      loading={sending}
                      disabled={
                        user.friendshipStatus !== "NONE"
                      }
                      onClick={() => handleSendRequestForUser(user)}
                    >
                      {user.friendshipStatus === "SELF"
                        ? "Você"
                        : user.friendshipStatus === "FRIENDS"
                        ? "Amigo"
                        : user.friendshipStatus === "PENDING_SENT"
                        ? "Solicitado"
                        : user.friendshipStatus === "PENDING_RECEIVED"
                        ? "Tem pedido"
                        : "Adicionar"}
                    </PrimaryButton>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleAddFriend} className="mt-6 space-y-3 border-t border-midnight-800/70 pt-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Ação rápida
            </p>
            <p className="text-xs text-slate-400">
              Enviar convite direto por nickname.
            </p>
            <PrimaryButton type="submit" loading={sending}>
              {sending ? "Enviando..." : "Enviar solicitação para a busca atual"}
            </PrimaryButton>
          </form>
      </section>

      <section className="mt-8 space-y-6">
        <header className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Lista de Amigos ({acceptedFriendsCount})</h2>
          <span className="text-xs uppercase tracking-[0.25em] text-slate-500">
            apenas aceitos
          </span>
        </header>

        {pendingRequests.length > 0 && (
          <div className="space-y-3 mb-6">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Solicitações Pendentes</h3>
              <div className="grid gap-3">
                  {incomingRequests.map(req => (
                      <div key={req.id} className="flex items-center justify-between rounded-xl border border-midnight-800 bg-midnight-900/60 p-4">
                          <div className="flex items-center gap-3">
                              <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-700">
                                  {req.user.avatarUrl ? (
                                      <img src={req.user.avatarUrl} alt={req.user.nickname} className="h-full w-full object-cover" />
                                  ) : (
                                      <div className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
                                          {req.user.displayName[0]}
                                      </div>
                                  )}
                              </div>
                              <div className="min-w-0">
                                  <ProfileIdentityLink
                                    userId={req.user.id}
                                    displayName={req.user.displayName}
                                    nickname={req.user.nickname}
                                  />
                              </div>
                          </div>
                          <div className="flex gap-2">
                              <button
                                  onClick={() => handleRespond(req.id, 'ACCEPTED')}
                                  className="px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold transition"
                              >
                                  Aceitar
                              </button>
                              <button
                                  onClick={() => handleRespond(req.id, 'REJECTED')}
                                  className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-bold transition"
                              >
                                  Recusar
                              </button>
                          </div>
                      </div>
                  ))}
                  {outgoingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="flex items-center justify-between rounded-xl border border-midnight-800 bg-midnight-900/40 p-4"
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
                        <div className="min-w-0">
                          <ProfileIdentityLink
                            userId={req.user.id}
                            displayName={req.user.displayName}
                            nickname={req.user.nickname}
                          />
                        </div>
                      </div>
                      <span className="rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
                        Enviado
                      </span>
                    </div>
                  ))}
              </div>
          </div>
        )}

        {loading ? (
           <div className="flex items-center gap-3 text-slate-400">
             <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500/40 border-t-indigo-300" />
             Carregando lista...
           </div>
        ) : friends.length > 0 ? (
          <div className="grid gap-4">
            {friends.map(friend => (
              <FriendCard key={friend.id} friend={friend} />
            ))}
          </div>
        ) : (
          <div className="rounded-shell border border-dashed border-midnight-800/70 p-8 text-center text-slate-400">
            Você ainda não tem amigos adicionados.
          </div>
        )}
      </section>
    </AppLayout>
  );
}

function ProfileIdentityLink({
  userId,
  displayName,
  nickname,
}: {
  userId: string;
  displayName: string;
  nickname: string;
}) {
  return (
    <Link
      to={`/users/${userId}`}
      className="group/profile block min-w-0 rounded-lg outline-none transition focus-visible:ring-2 focus-visible:ring-indigo-400/70"
    >
      <p className="truncate text-sm font-semibold text-white transition group-hover/profile:text-indigo-200 group-focus-visible/profile:text-indigo-200">
        {displayName}
      </p>
      <p className="truncate text-xs text-slate-400 transition group-hover/profile:text-indigo-300 group-focus-visible/profile:text-indigo-300">
        @{nickname}
      </p>
    </Link>
  );
}

function FriendCard({ friend }: { friend: AuthenticatedUser }) {
  // Calculate total playtime and top games
  const totalPlaytime = friend.gameStats?.reduce((acc, stat) => acc + (stat.playtime ?? 0), 0) || 0;
  const topGames = friend.gameStats?.sort((a, b) => (b.playtime ?? 0) - (a.playtime ?? 0)).slice(0, 3) || [];

  return (
    <div className="flex items-center gap-4 rounded-3xl border border-midnight-800 bg-midnight-900/40 p-4 transition hover:bg-midnight-800/40">
       <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl bg-indigo-500/20">
          {friend.avatarUrl ? (
            <img src={friend.avatarUrl} alt={friend.displayName} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-bold text-white text-lg">
                {friend.displayName[0]}
            </div>
          )}
       </div>
       
       <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link
              to={`/users/${friend.id}`}
              className="min-w-0 truncate font-semibold text-white transition hover:text-indigo-200 focus-visible:rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70"
            >
              {friend.displayName}
            </Link>
            {friend.steamId && (
                <span className="rounded bg-[#171a21] px-1.5 py-0.5 text-[10px] font-medium text-slate-300">
                    STEAM
                </span>
            )}
          </div>
          <Link
            to={`/users/${friend.id}`}
            className="block truncate text-sm text-slate-400 transition hover:text-indigo-300 focus-visible:rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70"
          >
            @{friend.nickname}
          </Link>
          
          <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
             <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                Online
             </div>
             <div>
                {Math.round(totalPlaytime / 60)}h jogadas
             </div>
          </div>
       </div>

       {topGames.length > 0 && (
         <div className="hidden sm:flex items-center gap-2">
            {topGames.map(stat => (
                <div key={stat.game.appId} className="relative group" title={`${stat.game.name} - ${Math.round(stat.playtime/60)}h`}>
                     <img 
                        src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${stat.game.appId}/capsule_184x69.jpg`} 
                        alt={stat.game.name} 
                        className="h-8 w-12 rounded bg-slate-800 object-cover opacity-80 group-hover:opacity-100 transition" 
                        onError={(e) => {
                            // Fallback to header if capsule fails or simple icon
                            (e.target as HTMLImageElement).src = `https://cdn.cloudflare.steamstatic.com/steam/apps/${stat.game.appId}/header.jpg`;
                        }}
                    />
                </div>
            ))}
         </div>
       )}
    </div>
  )
}
