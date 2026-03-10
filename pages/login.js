import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Nav from '../components/Nav';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { redirect } = router.query;

  // If already logged in, redirect to appropriate page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('username');
      if (stored && stored.trim() !== '') {
        router.replace(redirect || '/labelling');
      }
    }
  }, [router, redirect]);

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
      if (typeof window !== 'undefined') {
        localStorage.setItem('username', username);
        localStorage.setItem('name', data.name || username);
      }
      router.replace(redirect || '/labelling');
    } else {
      const data = await res.json();
      setError(data.error || 'Login failed');
    }
    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>Login | MHDash</title>
      </Head>

      <Nav />

      <main style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: 24, minHeight: '100vh', paddingTop: 60 }}>
        <div style={{ maxWidth: 350, margin: '48px auto', padding: 24, border: '1px solid #e0e0e0', borderRadius: 8 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Login</h1>
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: 12 }}>
              <label htmlFor="username" style={{ display: 'block', fontWeight: 500, marginBottom: 4, fontSize: 14 }}>
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                style={{ width: '100%', padding: 8, boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: 4, fontSize: 14 }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="password" style={{ display: 'block', fontWeight: 500, marginBottom: 4, fontSize: 14 }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: 8, boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: 4, fontSize: 14 }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: 10, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Logging in…' : 'Login'}
            </button>
            {error && (
              <div role="alert" style={{ color: '#a81318', marginTop: 10, fontSize: 14 }}>
                {error}
              </div>
            )}
          </form>
        </div>
      </main>
    </>
  );
}
