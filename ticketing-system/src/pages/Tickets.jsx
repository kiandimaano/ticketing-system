import { useState } from 'react';
import Sidebar, { SidebarMobileHeader } from '@/components/ui/Sidebar';

export default function Tickets() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-auto">
        <SidebarMobileHeader title="Tickets" onOpenMenu={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <h1 className="text-2xl font-semibold">Tickets</h1>
          <p className="mt-2 text-muted-foreground">Manage your tickets here.</p>
        </main>
      </div>
    </div>
  );
}
