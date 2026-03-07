import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar, { SidebarMobileHeader } from '@/components/ui/Sidebar';
import { Pencil, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getToken } from '@/services/storage';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Format DB datetime string as-is (no timezone conversion). */
function formatCreatedAt(value) {
  if (value == null || value === '') return '—';
  let s = String(value).trim().replace(/\s+GMT$/i, '').replace(/\s+UTC$/i, '').replace('T', ' ');
  const match = /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}:\d{2}:\d{2})/.exec(s);
  if (!match) return s;
  const [, year, month, day, time] = match;
  const monthIdx = parseInt(month, 10) - 1;
  const dayNum = parseInt(day, 10);
  if (monthIdx < 0 || monthIdx > 11) return s;
  return `${dayNum} ${MONTHS[monthIdx]} ${year}, ${time}`;
}

export default function ManageUsers() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    async function loadUsers() {
      const token = getToken();
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }
      try {
        setError(null);
        const response = await axios.get(`${BACKEND_URL}/api/accounts/get_all_users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const raw = response.data?.users ?? [];
        const list = (Array.isArray(raw) ? raw : []).map((u) => ({
          user_id: u.user_id,
          username: u.username,
          email: u.email,
          role: u.role,
          created_at: u.created_at
        }))
        setUsers(list);
      } catch (err) {
        console.error('Failed to fetch users', err);
        setError(err.response?.data?.message || 'Failed to fetch users');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-auto">
        <SidebarMobileHeader title="Manage Users" onOpenMenu={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <h1 className="text-2xl font-semibold text-foreground">Manage Users</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            View and manage user accounts.
          </p>

          <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            {loading && (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
                <Loader2 className="size-8 animate-spin" aria-hidden />
                <p className="text-sm font-medium">Loading users…</p>
              </div>
            )}
            {!loading && error && (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-destructive">
                <AlertCircle className="size-8" aria-hidden />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
            {!loading && !error && (
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
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
