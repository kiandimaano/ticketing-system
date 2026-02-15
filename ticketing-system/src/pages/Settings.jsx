import { useState } from 'react';
import Sidebar, { SidebarMobileHeader } from '@/components/ui/Sidebar';

export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-auto">
        <SidebarMobileHeader title="Settings" onOpenMenu={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="mt-2 text-muted-foreground">Configure your preferences here.</p>
        </main>
      </div>
    </div>
  );
}
