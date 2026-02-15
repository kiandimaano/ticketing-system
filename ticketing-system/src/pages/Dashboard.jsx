import { useState } from 'react';
import Sidebar, { SidebarMobileHeader } from '@/components/ui/Sidebar';
import { CardSmall } from '@/components/ui/CardSmall';
import { CreateTicket } from '@/components/ui/CreateTicket';

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
            <div className="flex min-w-0 flex-1 flex-col overflow-auto">
                <SidebarMobileHeader title="Dashboard" onOpenMenu={() => setSidebarOpen(true)} />

                <div className="flex flex-1 flex-col p-4 sm:p-6 md:p-8">
                    <div className="flex flex-row flex-wrap gap-4">
                        <CardSmall
                            title="Unresolved Tickets"
                            description="100"
                            content="Tickets unresolved the past 90 days"
                        />
                        <CardSmall
                            title="Resolved Tickets"
                            description="100"
                            content="Tickets resolved the past 90 days"
                        />
                        <CardSmall
                            title="Total Tickets"
                            description="200"
                            content="Tickets submitted the past 90 days"
                        />
                    </div>
                    <div className="mt-8">
                        <CreateTicket />
                    </div>
                </div>
            </div>
        </div>
    );
}