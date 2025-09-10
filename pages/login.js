import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

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
    <div style={{ maxWidth: 350, margin: '64px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
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
  );
}
