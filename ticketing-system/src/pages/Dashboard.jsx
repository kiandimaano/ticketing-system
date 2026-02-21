import { useState, useCallback } from 'react';
import Sidebar, { SidebarMobileHeader } from '@/components/ui/Sidebar';
import { CardSmall } from '@/components/ui/CardSmall';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { getToken } from '@/services/storage';
import { AlertBasic } from '@/components/ui/alert-basic';

export default function Dashboard() {
    const categoryOptions = ['Hardware', 'Software', 'Network', 'Access Request', 'Email', 'Security', 'Other'];

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Software');
    const [description, setDescription] = useState('');

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const handleDismiss = useCallback(() => setSuccessMessage(''), []);

    const handleSubmit = async () => {
        const token = getToken();
        try {
            await axios.post(`${BACKEND_URL}/api/issues/create_ticket`, { title, category, description },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                }
            );
            // Reset form
            setSuccessMessage('Ticket created successfully');
            setTitle('');
            setDescription('');
        } catch (err) {
            console.error('Error creating ticket', err);
        }
    }


    return (
        <div className="flex min-h-screen">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
            <div className="flex min-w-0 flex-1 flex-col overflow-auto">
                <SidebarMobileHeader title="Dashboard" onOpenMenu={() => setSidebarOpen(true)} />

                <div className="flex flex-1 flex-col p-4 sm:p-6 md:p-8">
                    {successMessage && (
                        <AlertBasic
                            title="Ticket created successfully"
                            description="Your ticket has been created successfully. Our support team will review it and get back to you as soon as possible."
                            onDismiss={handleDismiss}
                        />
                    )}
                    <div className="grid grid-cols-3 gap-4">
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
                    <div className="mt-8 rounded-xl border border-border bg-card shadow-sm">
                        <h2 className="border-b border-border bg-background py-4 text-center text-xl font-semibold text-foreground">
                            Create Support Ticket
                        </h2>
                        <div className="flex flex-col md:flex-row">
                            {/* Left column: form fields with alternating row backgrounds */}
                            <div className="flex flex-1 flex-col border-r border-border">
                                <div className="flex items-center justify-between gap-4 border-b border-border bg-background px-4 py-3">
                                    <label className="flex shrink-0 items-center gap-1 text-sm font-medium text-foreground">
                                        Issue Title
                                        <span className="text-destructive">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Brief summary of the issue"
                                        className="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>
                                {[
                                    {
                                        label: 'Category',
                                        value: category,
                                        onChange: setCategory,
                                        options: categoryOptions,
                                        type: 'select',
                                    },
                                ].map((field, index) => (
                                    <div
                                        key={field.label}
                                        className={cn(
                                            'flex items-center justify-between gap-4 border-b border-border px-4 py-3',
                                            index % 2 === 0 ? 'bg-background' : 'bg-muted/30'
                                        )}
                                    >
                                        <label className="flex shrink-0 items-center gap-1 text-sm font-medium text-foreground">
                                            {field.label}
                                            <span className="text-destructive">*</span>
                                            <ChevronDown className="size-4 text-foreground" aria-hidden />
                                        </label>
                                        <select
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            className="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        >
                                            {field.options.map((opt) => (
                                                <option key={opt} value={opt}>
                                                    {opt}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>

                            {/* Right column: Issue Description */}
                            <div className="flex flex-1 flex-col bg-muted/30 p-4">
                                <label className="mb-2 flex items-center gap-1 text-sm font-medium text-foreground">
                                    Issue Description
                                    <span className="text-destructive">*</span>
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe the issue in detail. Include steps to reproduce, any error messages, when it started, and what you've already tried. This helps our support team resolve your ticket faster."
                                    rows={10}
                                    className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex justify-end gap-3 border-t border-border bg-background px-4 py-4">
                            <button
                                type="button"
                                className="rounded-md bg-indigo-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                                onClick={handleSubmit}
                            >
                                Submit Ticket
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}