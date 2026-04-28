import { ReactNode, useState } from "react";

import { SidebarNav } from "./SidebarNav";
import { TopBarUser } from "./TopBarUser";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-midnight-950 text-slate-100">
      <SidebarNav isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col">
        <TopBarUser onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 bg-gradient-to-b from-midnight-950 via-midnight-900/70 to-midnight-950 px-4 py-10 md:px-8">
          <div className="mx-auto w-full max-w-7xl space-y-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
