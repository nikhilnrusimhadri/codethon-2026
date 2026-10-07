'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Layers,
  Megaphone,
  Gavel,
  Trophy,
  Settings,
  LogOut,
} from 'lucide-react';

const links = [
  ['/admin/dashboard', 'Dashboard', LayoutDashboard],
  ['/admin/registrations', 'Registrations', Users],
  ['/admin/rounds', 'Rounds', Layers],
  ['/admin/teams', 'Teams', Layers],
  ['/admin/announcements', 'Announcements', Megaphone],
  ['/admin/jury', 'Jury Panel', Gavel],
  ['/admin/results', 'Results', Trophy],
  ['/admin/settings', 'Settings', Settings],
] as const;

export function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch('/api/admin/logout', {
      method: 'POST',
    });

    router.push('/admin/login');
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '230px 1fr',
        minHeight: 'calc(100vh - 70px)',
      }}
    >
      <aside
        className="sidebar"
        style={{
          padding: 20,
          position: 'sticky',
          top: 70,
          height: 'calc(100vh - 70px)',
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: 12,
            color: 'var(--cyan)',
            marginBottom: 22,
          }}
        >
          ADMIN CONTROL
        </div>

        {links.map(([href, label, Icon]) => {
          const active = path === href;

          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                gap: 10,
                alignItems: 'center',
                padding: '11px 10px',
                borderRadius: 10,
                marginBottom: 4,
                background: active ? '#ffffff0b' : 'transparent',
                color: active ? '#fff' : 'var(--muted)',
                fontSize: 13,
              }}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}

        <button
          onClick={logout}
          style={{
            marginTop: 20,
            width: '100%',
            display: 'flex',
            gap: 10,
            alignItems: 'center',
            padding: '11px 10px',
            borderRadius: 10,
            border: 0,
            background: 'transparent',
            color: 'var(--muted)',
            cursor: 'pointer',
          }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </aside>

      <main
        style={{
          padding: 28,
          minWidth: 0,
        }}
      >
        {children}
      </main>
    </div>
  );
}

export function AdminTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div style={{ marginBottom: 25 }}>
      <div className="eyebrow">{eyebrow}</div>

      <h1
        style={{
          fontSize: 36,
          letterSpacing: '-.04em',
          margin: '6px 0',
        }}
      >
        {title}
      </h1>

      {description && <p className="muted">{description}</p>}
    </div>
  );
}