'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Menu,
  X,
  ArrowUpRight,
  Code2,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  ['/about', 'About'],
  ['/rounds', 'Rounds'],
  ['/eligibility', 'Eligibility'],
  ['/schedule', 'Schedule'],
  ['/announcements', 'Announcements'],
  ['/jury', 'Jury'],
  ['/teams', 'Teams'],
  ['/results', 'Results'],
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

  // Prevent the page from scrolling behind the mobile menu.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: '#05070bcc',
        backdropFilter: 'blur(18px)',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <div
        className="container"
        style={{
          minHeight: 70,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontWeight: 900,
            minWidth: 0,
          }}
        >
          <span
            style={{
              width: 34,
              height: 34,
              minWidth: 34,
              borderRadius: 10,
              display: 'grid',
              placeItems: 'center',
              background: '#fff',
              color: '#05070b',
            }}
          >
            <Code2 size={18} />
          </span>

          <span
            style={{
              whiteSpace: 'nowrap',
              fontSize: 15,
            }}
          >
            CODETHON <span className="gradient-text">2026</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav
          className="hide-mobile"
          style={{
            display: 'flex',
            gap: 18,
            fontSize: 13,
            color: 'var(--muted)',
            alignItems: 'center',
          }}
        >
          {navItems.map(([href, label]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}

          {/* Register */}
          <Link
            className="btn btn-primary"
            href="/register"
            style={{
              padding: '9px 13px',
              whiteSpace: 'nowrap',
            }}
          >
            Register
            <ArrowUpRight size={15} />
          </Link>

          {/* Admin Login */}
          <Link
            className="btn btn-ghost"
            href="/admin/login"
            style={{
              padding: '9px 13px',
              whiteSpace: 'nowrap',
            }}
          >
            Admin Login
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="hide-desktop"
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          style={{
            width: 44,
            height: 44,
            display: 'grid',
            placeItems: 'center',
            background: 'transparent',
            border: '1px solid var(--line)',
            borderRadius: 10,
            color: '#fff',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile navigation */}
      {open && (
        <div
          className="hide-desktop"
          style={{
            borderTop: '1px solid var(--line)',
            background: '#05070bf5',
            maxHeight: 'calc(100vh - 70px)',
            overflowY: 'auto',
          }}
        >
          <nav
            style={{
              padding: '8px 16px 24px',
            }}
          >
            {navItems.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: 52,
                  padding: '0 4px',
                  borderBottom: '1px solid var(--line)',
                  color: '#fff',
                  fontSize: 15,
                }}
              >
                <span>{label}</span>
                <ChevronRight size={17} color="var(--muted)" />
              </Link>
            ))}

            {/* Register */}
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="btn btn-primary"
              style={{
                width: '100%',
                marginTop: 18,
                minHeight: 48,
                justifyContent: 'center',
              }}
            >
              Register Now
              <ArrowUpRight size={17} />
            </Link>

            {/* Admin Login */}
            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="btn btn-ghost"
              style={{
                width: '100%',
                marginTop: 10,
                minHeight: 48,
                justifyContent: 'center',
              }}
            >
              Admin Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export function Countdown() {
  const target = new Date('2026-10-14T10:00:00+05:30').getTime();
  const end = new Date('2026-10-14T22:00:00+05:30').getTime();

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const d = Math.max(0, target - now);

  const days = Math.floor(d / 86400000);
  const hours = Math.floor((d % 86400000) / 3600000);
  const mins = Math.floor((d % 3600000) / 60000);
  const secs = Math.floor((d % 60000) / 1000);

  const live = now >= target && now < end;

  return (
    <div
      className="card glow"
      style={{
        padding: 'clamp(14px, 3vw, 20px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: 'clamp(6px, 2vw, 12px)',
      }}
    >
      {live ? (
        <div
          style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            fontWeight: 900,
            color: 'var(--green)',
            fontSize: 'clamp(12px, 3vw, 16px)',
          }}
        >
          ● CODETHON 2026 IS LIVE
        </div>
      ) : (
        <>
          {[
            ['DAYS', days],
            ['HOURS', hours],
            ['MIN', mins],
            ['SEC', secs],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              style={{
                textAlign: 'center',
                minWidth: 0,
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 'clamp(20px, 7vw, 32px)',
                  fontWeight: 700,
                  lineHeight: 1.1,
                }}
              >
                {String(value).padStart(2, '0')}
              </div>

              <div
                className="eyebrow"
                style={{
                  fontSize: 'clamp(7px, 2vw, 9px)',
                  marginTop: 5,
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--line)',
        padding: 'clamp(30px, 7vw, 50px) 0',
        background: '#030509',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 24,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 900 }}>CODETHON 2026</div>

          <div
            className="muted"
            style={{
              marginTop: 6,
              lineHeight: 1.6,
              maxWidth: 500,
            }}
          >
            Abhiruchi Club · Mother Teresa Institute of Science and Technology
          </div>
        </div>

        <div
          className="muted"
          style={{
            fontSize: 12,
            lineHeight: 1.6,
          }}
        >
          © 2026 CODETHON. Built for the MIST coding community.
        </div>
      </div>
    </footer>
  );
}

export function PageTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section
      className="section"
      style={{
        paddingBottom: 'clamp(30px, 6vw, 45px)',
      }}
    >
      <div className="container">
        <div className="eyebrow">{eyebrow}</div>

        <h1
          style={{
            fontSize: 'clamp(38px, 9vw, 78px)',
            lineHeight: 0.98,
            letterSpacing: '-0.05em',
            margin: '14px 0',
            maxWidth: '100%',
            overflowWrap: 'anywhere',
          }}
        >
          {title}
        </h1>

        <p
          className="muted"
          style={{
            maxWidth: 700,
            lineHeight: 1.8,
            fontSize: 'clamp(14px, 2vw, 16px)',
          }}
        >
          {description}
        </p>
      </div>
    </section>
  );
}