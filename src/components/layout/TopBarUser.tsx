import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { NotificationsDropdown } from "../notifications/NotificationsDropdown";
import { SecondaryButton } from "../ui/Buttons";

interface TopBarUserProps {
  onOpenSidebar: () => void;
}

export function TopBarUser({ onOpenSidebar }: TopBarUserProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const initials =
    user?.displayName
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "GG";

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const goToProfile = () => {
    setMenuOpen(false);
    navigate("/profile");
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-midnight-800/60 bg-midnight-950/80 px-4 py-4 backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-4">
        <button
          className="rounded-2xl border border-midnight-800 bg-midnight-900/60 p-2 text-slate-300 shadow-soft md:hidden"
          onClick={onOpenSidebar}
          aria-label="Abrir navegação"
        >
          ☰
        </button>
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Gankr squads</p>
          <p className="text-lg font-semibold text-white">Painel principal</p>
        </div>
      </div>

      <div className="flex items-center gap-4">

        <NotificationsDropdown />
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-3 rounded-2xl border border-midnight-800 bg-midnight-900/70 px-3 py-2 shadow-soft transition hover:border-indigo-400/60"
          >
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 text-base font-semibold text-white">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-white">{user?.displayName}</p>
              <p className="text-xs text-slate-400">@{user?.nickname}</p>
            </div>
            <span className="text-slate-400">▾</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-[calc(100%+0.5rem)] z-40 min-w-[220px] rounded-2xl border border-midnight-800 bg-midnight-900/95 p-2 shadow-soft backdrop-blur">
              <button
                type="button"
                onClick={goToProfile}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-midnight-800"
              >
                <span>Meu perfil</span>
                <span className="text-slate-500">/profile</span>
              </button>
              <SecondaryButton
                tone="danger"
                className="mt-2 w-full justify-center text-xs md:text-sm"
                onClick={logout}
              >
                Sair
              </SecondaryButton>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
