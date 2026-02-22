import { useState } from 'react';
import Sidebar, { SidebarMobileHeader } from '@/components/ui/Sidebar';
import { Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const DUMMY_USERS = [
  { user_id: 1, username: 'kian razen', email: 'kian@example.com', role: 'user', created_at: '2026-02-08 17:00:22' },
  { user_id: 2, username: 'Juan Dela Cruz', email: 'juan@example.com', role: 'admin', created_at: '2026-02-08 17:15:11' },
  { user_id: 4, username: 'Jeremy', email: 'jeremy@example.com', role: 'user', created_at: '2026-02-08 17:17:40' },
];

function formatCreatedAt(value) {
  if (value == null || value === '') return '—';
  const normalized = String(value).replace(' ', 'T');
  const d = new Date(normalized);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
}

export default function ManageUsers() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users] = useState(DUMMY_USERS);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === users.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(users.map((u) => u.user_id)));
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-auto">
        <SidebarMobileHeader title="Manage Users" onOpenMenu={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <h1 className="text-2xl font-semibold text-foreground">Manage Users</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            View and manage user accounts. Password column is hidden for security.
          </p>

          <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="w-10 px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={users.length > 0 && selectedIds.size === users.length}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 rounded border-input text-foreground focus:ring-2 focus:ring-ring"
                        aria-label="Select all"
                      />
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-foreground">user_id</th>
                    <th className="px-4 py-3 text-left font-medium text-foreground">username</th>
                    <th className="px-4 py-3 text-left font-medium text-foreground">email</th>
                    <th className="px-4 py-3 text-left font-medium text-foreground">role</th>
                    <th className="px-4 py-3 text-left font-medium text-foreground">created_at</th>
                    <th className="w-28 px-4 py-3 text-right font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={user.user_id}
                      className={cn(
                        'border-b border-border transition-colors hover:bg-muted/30',
                        index % 2 === 1 && 'bg-muted/10'
                      )}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(user.user_id)}
                          onChange={() => toggleSelect(user.user_id)}
                          className="h-4 w-4 rounded border-input text-foreground focus:ring-2 focus:ring-ring"
                          aria-label={`Select user ${user.username}`}
                        />
                      </td>
                      <td className="px-4 py-3 font-mono text-muted-foreground">{user.user_id}</td>
                      <td className="px-4 py-3 text-foreground">{user.username}</td>
                      <td className="px-4 py-3 text-foreground">{user.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                            user.role === 'admin'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          )}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{formatCreatedAt(user.created_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                            title="Edit"
                          >
                            <Pencil className="size-4" />
                          </button>
                          <button
                            type="button"
                            className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
                            title="Delete"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
