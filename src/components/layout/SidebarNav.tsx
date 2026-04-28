import type { SVGProps } from "react";
import { NavLink, useLocation } from "react-router-dom";

interface SidebarNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SidebarNav({ isOpen, onClose }: SidebarNavProps) {
  const location = useLocation();

  const isItemActive = (to: string) => {
    const toUrl = new URL(to, window.location.origin);
    const currentUrl = new URL(
      location.pathname + location.search,
      window.location.origin,
    );

    if (toUrl.pathname !== currentUrl.pathname) return false;

    return toUrl.searchParams.get("view") === currentUrl.searchParams.get("view");
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-midnight-800/70 bg-midnight-900/95 p-6 shadow-soft backdrop-blur-2xl transition-transform duration-300 md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 shadow-glow">
            <LogoIcon className="h-6 w-6 text-white" />
          </span>
          <div>
            <p className="text-xl font-bold tracking-tight text-white">Gankr</p>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Private squads</p>
          </div>
          <button
            className="ml-auto rounded-xl border border-midnight-700 p-2 text-slate-400 md:hidden"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            ✕
          </button>
        </div>

        <nav className="mt-10 flex flex-col gap-2 text-sm">
          {navItems.map(({ label, to, icon: Icon, soon }) => {
            return (
              <NavLink
                key={label}
                to={to}
                onClick={onClose}
                className={() =>
                  [
                    "group flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold transition",
                    isItemActive(to)
                      ? "bg-gradient-to-r from-indigo-500/30 to-purple-500/20 text-white shadow-glow"
                      : "text-slate-400 hover:bg-midnight-800/60 hover:text-white",
                  ].join(" ")
                }
              >
                <Icon className="h-5 w-5 text-indigo-300 group-hover:text-white" />
                <span>{label}</span>
                {soon && (
                  <span className="ml-auto rounded-full border border-aurum-400/50 px-2 py-0.5 text-[10px] uppercase tracking-widest text-aurum-400">
                    Breve
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

function LogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M4 6.5 12 3l8 3.5-8 4-8-4Z" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="m12 21-8-4.5V6.5l8 4 8-4v10L12 21Z" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

const DashboardIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path d="M4 13h6V4H4v9Zm10 7h6v-9h-6v9Zm-10 0h6v-5H4v5Zm10-10h6V4h-6v6Z" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const GroupsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm7 8v-1a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v1" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const SettingsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path
      d="m19.4 15 .9 1.5-1.5 2.6-1.7-.5a7 7 0 0 1-1.5.9l-.3 1.8h-3l-.3-1.8a7 7 0 0 1-1.5-.9l-1.7.5-1.5-2.6.9-1.5a6.6 6.6 0 0 1 0-2.1L3.8 11l1.5-2.6 1.7.5a7 7 0 0 1 1.5-.9l.3-1.8h3l.3 1.8a7 7 0 0 1 1.5.9l1.7-.5 1.5 2.6-.9 1.5a6.6 6.6 0 0 1 0 2.1Z"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="2.2" strokeWidth="1.5" />
  </svg>
);

const UserIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 21a8 8 0 1 0-16 0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FriendsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8.5" cy="7" r="4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 8v6M23 11h-6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const GameIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 8h4M8 12h8M10 16h4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 15l-3 3-3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: DashboardIcon },
  { label: "Meus grupos", to: "/social/groups", icon: GroupsIcon },
  { label: "Meus Amigos", to: "/social/friends", icon: FriendsIcon },
  { label: "Meus Jogos", to: "/my-games", icon: GameIcon },
  { label: "Meu Perfil", to: "/profile", icon: UserIcon },
  {
    label: "Configurações",
    to: "/dashboard?view=settings",
    icon: SettingsIcon,
    soon: true,
  },
];
