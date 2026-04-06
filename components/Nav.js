import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/benchmark',   label: 'Benchmark' },
  { href: '/posts',       label: 'Posts' },
  { href: '/progress',    label: 'Progress' },
  { href: '/dataset',     label: 'Dataset' },
  { href: '/publication', label: 'Publication' },
  { href: '/participants', label: 'Participants' },
];

const navBarStyle = {
  width: '100%',
  background: '#ce181e',
  color: '#fff',
  margin: 0,
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  zIndex: 1000,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  minHeight: 48,
  position: 'fixed',
  top: 0,
  left: 0,
};

const desktopLinkStyle = {
  padding: '8px 14px',
  fontSize: 15,
  background: '#fff',
  color: '#ce181e',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
  fontWeight: 600,
  boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  alignSelf: 'center',
  height: 34,
  lineHeight: 1.4,
};

const activeDesktopLinkStyle = {
  ...desktopLinkStyle,
  boxShadow: 'inset 0 0 0 2px #ce181e',
};

/**
 * Shared navigation bar.
 *
 * Props:
 *   loggedIn  {boolean}  — show Logout instead of Login (default false)
 *   onLogout  {function} — called when user clicks Logout; if omitted,
 *                          clears localStorage and navigates to "/"
 */
export default function Nav({ loggedIn = false, onLogout }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    setOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('username');
        localStorage.removeItem('name');
      }
      router.push('/');
    }
  };

  return (
    <nav role="navigation" aria-label="Main navigation" style={navBarStyle}>
      {/* Site identity — always links home */}
      <div style={{ marginLeft: 16, flexShrink: 0 }}>
        <Link href="/" aria-label="MHDash — Home" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <img src="/mhdash_logo.svg" alt="MHDash Logo" style={{ height: 32, objectFit: 'contain' }} />
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 18, letterSpacing: '0.3px' }}>MHDash</span>
        </Link>
      </div>

      {/* Desktop nav links */}
      <div className="desktop-nav" style={{ marginRight: 24, display: 'flex', gap: 8, alignItems: 'center' }}>
        {NAV_LINKS.map(({ href, label }) => {
          const active = router.pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={active ? activeDesktopLinkStyle : desktopLinkStyle}
              aria-current={active ? 'page' : undefined}
            >
              {label}
            </Link>
          );
        })}
        {loggedIn ? (
          <button onClick={handleLogout} style={desktopLinkStyle}>
            Logout
          </button>
        ) : (
          <Link
            href="/login"
            style={router.pathname === '/login' ? activeDesktopLinkStyle : desktopLinkStyle}
            aria-current={router.pathname === '/login' ? 'page' : undefined}
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile hamburger toggle */}
      <div className="mobile-nav-toggle" style={{ marginRight: 16, display: 'none' }}>
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="nav-mobile-menu"
          aria-label="Toggle navigation menu"
          style={{ ...desktopLinkStyle, padding: '8px 12px' }}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div id="nav-mobile-menu" className="mobile-menu" role="menu">
          {NAV_LINKS.map(({ href, label }) => {
            const active = router.pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="mobile-menu-button"
                role="menuitem"
                aria-current={active ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            );
          })}
          {loggedIn ? (
            <button
              className="mobile-menu-button"
              role="menuitem"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="mobile-menu-button"
              role="menuitem"
              aria-current={router.pathname === '/login' ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
