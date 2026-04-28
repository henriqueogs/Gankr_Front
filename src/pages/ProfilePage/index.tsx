import { FormEvent, useEffect, useMemo, useState } from "react";

import { gameApi, getApiErrorMessage, userApi } from "../../api/client";
import { GameSearchResult } from "../../api/types";
import { AppLayout } from "../../components/layout/AppLayout";
import { PrimaryButton, SecondaryButton } from "../../components/ui/Buttons";
import { useAuth } from "../../hooks/useAuth";
import { useSteam } from "../../services/useSteam";

const inputClasses =
  "w-full rounded-2xl border border-midnight-800 bg-midnight-900/60 px-4 py-3 text-base text-slate-100 placeholder-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition";

interface FavoriteGameInput {
  appId: string;
  name: string;
}

export function ProfilePage() {
  const { user, token, setUserSession } = useAuth();
  const { linkSteam, syncSteam, loading: steamLoading, error: steamError } = useSteam();
  const [steamIdInput, setSteamIdInput] = useState("");

  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [bio, setBio] = useState("");
  const [favoriteGames, setFavoriteGames] = useState<FavoriteGameInput[]>([]);

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [gameQuery, setGameQuery] = useState("");
  const [gameResults, setGameResults] = useState<GameSearchResult[]>([]);
  const [searchingGames, setSearchingGames] = useState(false);

  useEffect(() => {
    if (!user) return;
    setDisplayName(user.displayName ?? "");
    setAvatarUrl(user.avatarUrl ?? "");
    setCoverImageUrl(user.coverImageUrl ?? "");
    setBio(user.bio ?? "");
    setFavoriteGames(
      (user.favoriteGames ?? []).map((entry) => ({
        appId: entry.game.appId,
        name: entry.game.name,
      })),
    );
  }, [user]);

  const handleLink = async (e: FormEvent) => {
    e.preventDefault();
    if (!steamIdInput) return;
    await linkSteam(steamIdInput);
  };

  const handleSync = async () => {
    await syncSteam();
    setSaveMessage("Dados da Steam sincronizados.");
  };

  const handleSearchGames = async () => {
    if (gameQuery.trim().length < 2) return;

    setSearchingGames(true);
    setSaveError(null);
    try {
      const games = await gameApi.search(gameQuery.trim(), 12);
      setGameResults(games);
    } catch {
      setGameResults([]);
      setSaveError("Não foi possível buscar jogos agora.");
    } finally {
      setSearchingGames(false);
    }
  };

  const canAddMoreFavorites = favoriteGames.length < 12;

  const availableResults = useMemo(
    () =>
      gameResults.filter(
        (result) =>
          !favoriteGames.some((favorite) => favorite.appId === result.appId),
      ),
    [gameResults, favoriteGames],
  );

  const addFavoriteGame = (game: GameSearchResult) => {
    if (!canAddMoreFavorites) return;
    setFavoriteGames((prev) => [...prev, { appId: game.appId, name: game.name }]);
  };

  const removeFavoriteGame = (appId: string) => {
    setFavoriteGames((prev) => prev.filter((game) => game.appId !== appId));
  };

  const handleSaveProfile = async (event: FormEvent) => {
    event.preventDefault();
    if (!user || !token) return;

    setSaving(true);
    setSaveError(null);
    setSaveMessage(null);
    try {
      const updatedUser = await userApi.updateMe({
        displayName: displayName.trim(),
        avatarUrl: avatarUrl.trim() || null,
        coverImageUrl: coverImageUrl.trim() || null,
        bio: bio.trim() || null,
        favoriteGames,
      });
      setUserSession(token, updatedUser);
      setSaveMessage("Perfil atualizado com sucesso.");
    } catch (err: unknown) {
      const message = getApiErrorMessage(err, "Falha ao salvar o perfil.");
      setSaveError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <section className="overflow-hidden rounded-shell border border-midnight-800/80 bg-midnight-900/60 shadow-soft">
        <div className="relative h-44 w-full overflow-hidden border-b border-midnight-800/70">
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt="Capa do perfil"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-indigo-700/50 via-fuchsia-700/30 to-midnight-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-midnight-950/90 to-transparent" />
          <div className="absolute bottom-4 left-6 flex items-center gap-4">
            <div className="h-20 w-20 overflow-hidden rounded-3xl border border-midnight-700 bg-midnight-900">
              {avatarUrl || user?.avatarUrl ? (
                <img
                  src={avatarUrl || user?.avatarUrl || ""}
                  alt={displayName || user?.displayName || "Perfil"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white">
                  {(displayName || user?.displayName || "G").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                Meu perfil
              </p>
              <h1 className="text-3xl font-bold text-white">
                {displayName || user?.displayName}
              </h1>
              <p className="text-slate-300">@{user?.nickname}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <form
          onSubmit={handleSaveProfile}
          className="space-y-6 rounded-shell border border-midnight-800/80 bg-midnight-900/60 p-6 shadow-soft"
        >
          <div>
            <h2 className="text-2xl font-semibold text-white">Editar perfil</h2>
            <p className="text-sm text-slate-400">
              Atualize aparência e informações públicas do seu perfil.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-500">Nome exibido</label>
              <input
                className={inputClasses}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                minLength={3}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-500">Avatar (URL)</label>
              <input
                className={inputClasses}
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-500">Imagem de capa (URL)</label>
            <input
              className={inputClasses}
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-500">Descrição</label>
            <textarea
              className={`${inputClasses} min-h-[120px] resize-y`}
              maxLength={500}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Fale um pouco sobre você, estilo de jogo e objetivos."
            />
            <p className="mt-1 text-xs text-slate-500">{bio.length}/500</p>
          </div>

          <div className="space-y-3 rounded-2xl border border-midnight-800/70 bg-midnight-950/40 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Jogos preferidos</p>
              <p className="text-xs text-slate-500">{favoriteGames.length}/12</p>
            </div>

            {favoriteGames.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {favoriteGames.map((game) => (
                  <button
                    key={game.appId}
                    type="button"
                    onClick={() => removeFavoriteGame(game.appId)}
                    className="rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-200 transition hover:bg-red-500/20 hover:text-red-200"
                    title="Remover"
                  >
                    {game.name} ×
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Nenhum jogo favorito adicionado ainda.
              </p>
            )}

            <div className="grid gap-2 md:grid-cols-[1fr_auto]">
              <input
                className={inputClasses}
                placeholder="Buscar jogo por nome"
                value={gameQuery}
                onChange={(e) => setGameQuery(e.target.value)}
              />
              <SecondaryButton type="button" loading={searchingGames} onClick={handleSearchGames}>
                Buscar
              </SecondaryButton>
            </div>

            {availableResults.length > 0 && (
              <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
                {availableResults.map((game) => (
                  <button
                    key={game.appId}
                    type="button"
                    onClick={() => addFavoriteGame(game)}
                    disabled={!canAddMoreFavorites}
                    className="flex w-full items-center justify-between rounded-xl border border-midnight-800 bg-midnight-900/60 px-3 py-2 text-left transition hover:border-indigo-400/60 disabled:opacity-50"
                  >
                    <span className="truncate text-sm text-slate-200">{game.name}</span>
                    <span className="text-xs text-slate-500">AppID {game.appId}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {saveError && (
            <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">
              {saveError}
            </div>
          )}
          {saveMessage && (
            <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-3 text-sm text-emerald-200">
              {saveMessage}
            </div>
          )}

          <PrimaryButton type="submit" loading={saving}>
            {saving ? "Salvando..." : "Salvar perfil"}
          </PrimaryButton>
        </form>

        <aside className="space-y-6">
          <div className="rounded-shell border border-midnight-800/80 bg-midnight-900/60 p-6 shadow-soft">
            <h3 className="mb-4 text-xl font-semibold text-white">Integração Steam</h3>
            {user?.steamId ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-400">
                  Conta vinculada: <span className="font-mono text-slate-200">{user.steamId}</span>
                </p>
                {user.steamProfileUrl && (
                  <a
                    href={user.steamProfileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-indigo-300 hover:text-indigo-200"
                  >
                    Ver perfil Steam
                  </a>
                )}
                <PrimaryButton onClick={handleSync} loading={steamLoading}>
                  {steamLoading ? "Sincronizando..." : "Sincronizar dados Steam"}
                </PrimaryButton>
              </div>
            ) : (
              <form onSubmit={handleLink} className="space-y-4">
                <p className="text-sm text-slate-400">
                  Vincule sua Steam para sincronizar jogos e estatísticas.
                </p>
                <input
                  className={inputClasses}
                  value={steamIdInput}
                  onChange={(e) => setSteamIdInput(e.target.value)}
                  placeholder="Steam ID 64"
                  required
                />
                {steamError && (
                  <p className="text-sm text-red-400">{steamError}</p>
                )}
                <PrimaryButton type="submit" loading={steamLoading}>
                  {steamLoading ? "Vinculando..." : "Vincular Steam"}
                </PrimaryButton>
              </form>
            )}
          </div>
        </aside>
      </section>
    </AppLayout>
  );
}
