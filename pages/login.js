import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // If already logged in, redirect to /labelling
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const username = localStorage.getItem('username');
      if (username && username.trim() !== '') {
        router.replace('/labelling');
      }
    }
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      const data = await res.json();
      // Store username, name and redirect to labelling page
      if (typeof window !== 'undefined') {
        localStorage.setItem('username', username);
        localStorage.setItem('name', data.name || username);
      }
      router.replace('/labelling');
    } else {
      const data = await res.json();
      setError(data.error || 'Login failed');
    }
    setLoading(false);
  }

  return (
    <>
      {/* Top Bar with Navigation Buttons */}
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          overscroll-behavior: none;
        }
        @media (max-width: 600px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-toggle { display: flex !important; }
        }
        @media (min-width: 601px) {
          .mobile-nav-toggle { display: none !important; }
          .mobile-menu { display: none !important; }
        }
        .mobile-menu {
          position: fixed;
          top: 48px;
          right: 0;
          background: white;
          width: 200px;
          box-shadow: -2px 2px 10px rgba(0,0,0,0.1);
          border-radius: 0 0 0 8px;
          z-index: 1000;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .mobile-menu-button {
          width: 100%;
          text-align: left;
          padding: 12px 16px;
          background: white;
          color: #ce181e;
          border: none;
          border-bottom: 1px solid #f0f0f0;
          font-weight: 600;
          cursor: pointer;
        }
        .mobile-menu-button:hover {
          background: #f9f9f9;
        }
      `}</style>
      <div style={{ width: '100%', background: '#ce181e', color: '#fff', padding: '8px 0', margin: 0, textAlign: 'center', fontWeight: 600, fontSize: 18, letterSpacing: '0.5px', boxShadow: '0 2px 8px #eee', zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 48, position: 'fixed', top: 0, left: 0 }}>
        <div style={{ marginLeft: 16 }}>
          <button
            style={{ padding: '8px 18px', fontSize: 16, background: '#fff', color: '#ce181e', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, boxShadow: '0 1px 4px #bdbdbd' }}
            onClick={() => router.push('/')}
          >
            Back to Dashboard
          </button>
        </div>
        
        {/* Desktop Navigation */}
        <div className="desktop-nav" style={{ marginRight: 32 }}>
          <button
            style={{ marginRight: 16, padding: '8px 18px', fontSize: 16, background: '#fff', color: '#ce181e', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, boxShadow: '0 1px 4px #bdbdbd' }}
            onClick={() => router.push('/participants')}
          >
            Participants
          </button>
          <button
            style={{ marginRight: 16, padding: '8px 18px', fontSize: 16, background: '#fff', color: '#ce181e', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, boxShadow: '0 1px 4px #bdbdbd' }}
            onClick={() => router.push('/progress')}
          >
            Progress
          </button>
          <button
            style={{ marginRight: 16, padding: '8px 18px', fontSize: 16, background: '#fff', color: '#ce181e', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, boxShadow: '0 1px 4px #bdbdbd' }}
            onClick={() => router.push('/dataset')}
          >
            Dataset
          </button>
          <button
            style={{ padding: '8px 18px', fontSize: 16, background: '#fff', color: '#ce181e', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, boxShadow: '0 1px 4px #bdbdbd' }}
            onClick={() => router.push('/login')}
          >
            Login
          </button>
        </div>
        
        {/* Mobile Menu Toggle Button */}
        <div className="mobile-nav-toggle" style={{ marginRight: 16, display: 'none' }}>
          <button 
            onClick={toggleMobileMenu}
            style={{ padding: '8px 12px', fontSize: 16, background: '#fff', color: '#ce181e', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, boxShadow: '0 1px 4px #bdbdbd' }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <button className="mobile-menu-button" onClick={() => router.push('/participants')}>
              Participants
            </button>
            <button className="mobile-menu-button" onClick={() => router.push('/progress')}>
              Progress
            </button>
            <button className="mobile-menu-button" onClick={() => router.push('/dataset')}>
              Dataset
            </button>
            <button className="mobile-menu-button" onClick={() => router.push('/login')}>
              Login
            </button>
          </div>
        )}
      </div>
      
      <main style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: 24, minHeight: '100vh', paddingTop: 48 }}>
        <div style={{ maxWidth: 350, margin: '48px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{ width: '100%', marginBottom: 12, padding: 8 }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', marginBottom: 12, padding: 8 }}
            />
            <button type="submit" style={{ width: '100%', padding: 10, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6 }}>Login</button>
            {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
          </form>
        </div>
      </main>
    </>
  );
}
