import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Ticket, Settings, X, Menu, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { removeToken } from '@/services/storage';

/**
 * Mobile header with menu button and page title. Use in the main content area
 * when using Sidebar with isOpen/onClose so the sidebar can be opened on small screens.
 *
 * @param {Object} props
 * @param {string} props.title - Page title shown next to the menu button
 * @param {() => void} props.onOpenMenu - Called when the menu button is clicked
 */
export function SidebarMobileHeader({ title, onOpenMenu }) {
  return (
    <header className="sticky top-0 z-30 flex shrink-0 items-center gap-3 border-b border-border bg-background px-4 py-3 md:hidden">
      <button
        type="button"
        aria-label="Open menu"
        onClick={onOpenMenu}
        className="rounded-lg bg-black p-2 text-white hover:bg-black/90"
      >
        <Menu className="size-6" />
      </button>
      <span className="font-semibold text-black">{title}</span>
    </header>
  );
}

const defaultNavItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tickets', label: 'Tickets', icon: Ticket },
  { to: '/settings', label: 'Settings', icon: Settings },
];

/**
 * Reusable Sidebar component. Use on any page by wrapping or placing next to main content.
 * On small screens: hidden by default (main content full width). Pass isOpen + onClose and
 * render a menu button in your page to open the sidebar as an overlay.
 *
 * @param {Object} props
 * @param {Array<{ to: string, label: string, icon?: React.ComponentType<{ className?: string }> }>} [props.navItems] - Links to show
 * @param {string} [props.className] - Extra Tailwind classes for the sidebar container
 * @param {React.ReactNode} [props.children] - Optional content below nav (e.g. extra links, footer)
 * @param {boolean} [props.isOpen] - When true on small screens, sidebar overlay is visible
 * @param {() => void} [props.onClose] - Callback to close sidebar (e.g. when backdrop or link clicked)
 */
export default function Sidebar({ navItems = defaultNavItems, className, children, isOpen = false, onClose }) {
  const isOverlay = typeof onClose === 'function';
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    if (isOverlay) onClose();
    navigate('/login', { replace: true });
  };

  return (
    <>
      {/* Backdrop: only when overlay mode and open, on small screens */}
      {isOverlay && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className={cn(
            'fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden',
            isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          )}
        />
      )}

      <aside
        className={cn(
          'flex h-screen min-h-screen w-72 flex-col shrink-0',
          'border-r border-sidebar-border bg-sidebar text-sidebar-foreground',
          'shadow-[4px_0_24px_-4px_rgba(0,0,0,0.08)]',
          'transition-transform duration-200 ease-out',
          // Small screens: overlay when isOpen/onClose provided, else hidden
          isOverlay
            ? cn(
              'fixed inset-y-0 left-0 z-50 md:relative md:translate-x-0',
              isOpen ? 'translate-x-0' : '-translate-x-full'
            )
            : 'hidden md:flex',
          className
        )}
        aria-label="Sidebar"
        aria-hidden={isOverlay && !isOpen}
      >
        {/* Header / brand */}
        <div className="flex items-center justify-between gap-3 border-b border-sidebar-border px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
              <Ticket className="size-5" aria-hidden />
            </div>
            <div>
              <span className="block text-base font-semibold tracking-tight">Ticketing</span>
              <span className="block text-xs text-sidebar-foreground/60">Support & tickets</span>
            </div>
          </div>
          {isOverlay && (
            <button
              type="button"
              aria-label="Close menu"
              onClick={onClose}
              className="rounded-lg bg-black p-2 text-white hover:bg-black/90 md:hidden"
            >
              <X className="size-5" />
            </button>
          )}
        </div>

        {/* Nav section */}
        <div className="flex flex-1 flex-col gap-1 px-4 py-6">
          <span className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/50">
            Menu
          </span>
          <nav className="flex flex-col gap-0.5" aria-label="Main">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={isOverlay ? onClose : undefined}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                      : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground'
                  )
                }
                end={to === '/dashboard'}
              >
                {Icon && <Icon className="size-5 shrink-0 opacity-80" aria-hidden />}
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer: logout + optional children */}
        <div className="mt-auto border-t border-sidebar-border bg-sidebar/50 px-4 py-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg bg-white px-3 py-3 text-sm font-medium text-black transition-all duration-200 hover:bg-gray-100"
          >
            <LogOut className="size-5 shrink-0 opacity-80" aria-hidden />
            <span>Log out</span>
          </button>
          {children && <div className="mt-2">{children}</div>}
        </div>
      </aside>
    </>
  );
}
