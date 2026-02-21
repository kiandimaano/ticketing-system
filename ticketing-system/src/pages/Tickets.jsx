import { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '@/services/storage';
import Sidebar, { SidebarMobileHeader } from '@/components/ui/Sidebar';
import {
  Ticket as TicketIcon,
  Calendar,
  Tag,
  Search,
  Filter,
  ChevronDown,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
];

const statusStyles = {
  open: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  in_progress:
    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  resolved:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
};

function formatDate(isoString) {
  if (isoString == null || isoString === '') return '—';
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return '—';
  const now = new Date();
  const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today, ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return d.toLocaleDateString([], { weekday: 'short' });
  return d.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function Tickets() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTickets() {
      const token = getToken();
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }
      try {
        setError(null);
        const response = await axios.get(`${BACKEND_URL}/api/issues/get_all_user_tickets`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const raw = response.data?.tickets ?? [];
        const list = (Array.isArray(raw) ? raw : []).map((t) => ({
          id: t.id ?? t.ticket_id,
          title: t.title,
          category: t.category,
          status: t.status ?? 'open',
          description: t.description,
          createdAt: t.createdAt ?? t.submitted_at ?? t.created_at,
        }));
        setTickets(list);
      } catch (err) {
        console.error('Failed to fetch tickets', err);
        setError(err.response?.data?.message || 'Failed to fetch tickets');
        setTickets([]);
      } finally {
        setLoading(false);
      }
    }
    loadTickets();
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus =
      statusFilter === 'all' || ticket.status === statusFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      ticket.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(ticket.id ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-auto">
        <SidebarMobileHeader
          title="Tickets"
          onOpenMenu={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          {/* Page header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                My Tickets
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                View and track all tickets you&apos;ve submitted
              </p>
            </div>
          </div>

          {/* Search and filter bar */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <input
                type="text"
                placeholder="Search by title, ID, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setFilterDropdownOpen((o) => !o)}
                className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <Filter className="size-4" aria-hidden />
                {STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ??
                  'Status'}
                <ChevronDown
                  className={cn(
                    'size-4 transition-transform',
                    filterDropdownOpen && 'rotate-180'
                  )}
                  aria-hidden
                />
              </button>
              {filterDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    aria-hidden
                    onClick={() => setFilterDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-full z-20 mt-1 min-w-40 rounded-lg border border-border bg-popover py-1 shadow-lg">
                    {STATUS_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setStatusFilter(opt.value);
                          setFilterDropdownOpen(false);
                        }}
                        className={cn(
                          'w-full px-4 py-2 text-left text-sm transition-colors',
                          statusFilter === opt.value
                            ? 'bg-accent text-accent-foreground'
                            : 'text-popover-foreground hover:bg-muted/50'
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Ticket list */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <p className="text-sm text-muted-foreground">Loading tickets...</p>
              </div>
            ) : error ? (
              <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 py-16 text-center">
                <TicketIcon className="size-12 text-muted-foreground" />
                <p className="mt-3 text-sm font-medium text-foreground">
                  No tickets found
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter.'
                    : 'Tickets you submit will appear here.'}
                </p>
              </div>
            ) : (
              filteredTickets.map((ticket, index) => (
                <article
                  key={ticket.id ?? `ticket-${index}`}
                  className="rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 p-4 sm:p-5 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm font-medium text-muted-foreground">
                          {ticket.id}
                        </span>
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
                            statusStyles[ticket.status]
                          )}
                        >
                          {ticket.status === 'in_progress'
                            ? 'In Progress'
                            : ticket.status === 'open'
                              ? 'Open'
                              : 'Resolved'}
                        </span>
                      </div>
                      <h2 className="mt-2 text-lg font-semibold text-card-foreground">
                        {ticket.title}
                      </h2>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {ticket.description}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Tag className="size-3.5" aria-hidden />
                          {ticket.category}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="size-3.5" aria-hidden />
                          {formatDate(ticket.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <MessageSquare className="size-4" aria-hidden />
                        View details
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
