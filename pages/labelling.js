import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Nav from '../components/Nav';

export default function Labelling() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [current, setCurrent] = useState(0);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [labelsSubmitted, setLabelsSubmitted] = useState(false);

  // Simple auth check: redirect if no username in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('username')) {
      router.replace('/login');
    }
  }, [router]);

  const username = (typeof window !== 'undefined') ? localStorage.getItem('username') : '';
  const name     = (typeof window !== 'undefined') ? localStorage.getItem('name')     : username;

  // Load initial posts
  useEffect(() => {
    fetchUnlabelledPosts();
  }, []);

  const handleSelect = (field, value) => {
    setLabels(labels => {
      const newLabels = [...labels];
      newLabels[current][field] = value;
      return newLabels;
    });
  };

  async function handleSubmit() {
    setSubmitStatus(null);
    setLoading(true);

    try {
      if (!labels.every(l => l.type && l.scale)) {
        setSubmitStatus({ success: false, message: 'Please label all posts before submitting.' });
        setLoading(false);
        return;
      }

      const res = await fetch('/api/submit_labels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          labels: posts.map((post, i) => ({
            hash:  post.post_hash,
            box1:  labels[i].type,
            box2:  labels[i].scale
          })),
          username
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSubmitStatus({ success: true, message: 'Labels submitted successfully!' });
        setLabelsSubmitted(true);
        console.log('Submit successful:', data);
      } else {
        const err = await res.json();
        setSubmitStatus({ success: false, message: err.error || 'Submission failed.' });
        console.error('Submit error:', err);
      }
    } catch (err) {
      console.error('Submit exception:', err);
      setSubmitStatus({ success: false, message: err.message || 'Submission failed.' });
    } finally {
      setLoading(false);
    }
  }

  async function fetchUnlabelledPosts() {
    setLoading(true);
    setError(null);
    setSubmitStatus(null);
    setLabelsSubmitted(false);

    try {
      const u = localStorage.getItem('username');
      const res = await fetch(`/api/unlabelled_posts?username=${encodeURIComponent(u)}`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch unlabelled posts');
      }

      const data = await res.json();

      if (data.posts && data.posts.length > 0) {
        setPosts(data.posts);
        setLabels(data.posts.map(() => ({ type: '', scale: '' })));
        setCurrent(0);
        setSubmitStatus({ success: true, message: 'New unlabelled posts loaded!' });
      } else {
        setSubmitStatus({ success: false, message: 'No more unlabelled posts found. Try again later.' });
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setSubmitStatus({ success: false, message: `Error: ${err.message}` });
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('username');
      localStorage.removeItem('name');
      router.replace('/login');
    }
  };

  if (loading) return (
    <>
      <Head><title>Labelling | MHDash</title></Head>
      <Nav loggedIn onLogout={handleLogout} />
      <div role="status" aria-live="polite" style={{ padding: '80px 24px' }}>Loading posts…</div>
    </>
  );
  if (error) return (
    <>
      <Head><title>Labelling | MHDash</title></Head>
      <Nav loggedIn onLogout={handleLogout} />
      <div role="alert" style={{ color: '#a81318', padding: '80px 24px' }}>{error}</div>
    </>
  );
  if (!posts.length) return (
    <>
      <Head><title>Labelling | MHDash</title></Head>
      <Nav loggedIn onLogout={handleLogout} />
      <div role="status" style={{ padding: '80px 24px' }}>No posts available.</div>
    </>
  );

  return (
    <>
      <Head>
        <title>Labelling | MHDash</title>
      </Head>

      <Nav loggedIn onLogout={handleLogout} />

      <div style={{ maxWidth: 600, margin: '64px auto', padding: 24, border: '1px solid #e0e0e0', borderRadius: 8, position: 'relative' }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Labeling Page</h1>
        <div style={{ marginBottom: 16, fontSize: 16, color: '#333' }}>
          Hello, {name || username}!
        </div>

        {/* Post index dots */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 16 }} role="group" aria-label="Post navigation">
          {posts.map((_, idx) => {
            const labeled = labels[idx]?.type && labels[idx]?.scale;
            const isCurrent = idx === current;
            return (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                aria-label={`Post ${idx + 1}${labeled ? ', labeled' : ''}${isCurrent ? ', current' : ''}`}
                aria-current={isCurrent ? 'true' : undefined}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  border: 'none',
                  background: isCurrent ? '#1976d2' : labeled ? '#333' : '#eee',
                  color:      isCurrent ? '#fff'    : labeled ? '#fff' : '#333',
                  fontWeight: isCurrent ? 'bold' : 'normal',
                  cursor: 'pointer',
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Current post */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Post #{current + 1}</div>
          <div style={{ whiteSpace: 'pre-line', marginBottom: 10 }}>{posts[current].title}</div>
          <div style={{ color: '#595959', marginBottom: 10 }}>{posts[current].body}</div>
          <div style={{ fontSize: 13, color: '#595959', marginBottom: 6 }}>Created: {new Date(posts[current].created).toLocaleString()}</div>
        </div>

        {/* Type selection */}
        <fieldset style={{ marginBottom: 18, background: '#e3f2fd', padding: '12px 16px', borderRadius: 8, border: '1.5px solid #90caf9' }}>
          <legend style={{ fontWeight: 500, padding: '0 4px' }}>Suicide Type</legend>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 18, marginBottom: 8, flexWrap: 'wrap' }}>
            {['Attempt', 'Behavior', 'Ideation', 'Indicator', 'Supportive'].map(label => (
              <label key={label} style={{ display: 'flex', alignItems: 'center', fontWeight: 400, minWidth: 90 }}>
                <input
                  type="radio"
                  name={`type-${current}`}
                  value={label}
                  checked={labels[current].type === label}
                  onChange={e => handleSelect('type', e.target.value)}
                  style={{ marginRight: 6 }}
                />
                {label}
              </label>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 18, flexWrap: 'wrap' }}>
            {['Unsure', 'Not Related'].map(label => (
              <label key={label} style={{ display: 'flex', alignItems: 'center', fontWeight: 400, minWidth: 90 }}>
                <input
                  type="radio"
                  name={`type-${current}`}
                  value={label}
                  checked={labels[current].type === label}
                  onChange={e => handleSelect('type', e.target.value)}
                  style={{ marginRight: 6 }}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Scale selection */}
        <fieldset style={{ marginBottom: 18, background: '#fce4ec', padding: '12px 16px', borderRadius: 8, border: '1.5px solid #f48fb1' }}>
          <legend style={{ fontWeight: 500, padding: '0 4px' }}>Risk Scale</legend>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 18, marginBottom: 8, flexWrap: 'wrap' }}>
            {['Severe', 'Moderate', 'Minor', 'No'].map(label => (
              <label key={label} style={{ display: 'flex', alignItems: 'center', fontWeight: 400, minWidth: 90 }}>
                <input
                  type="radio"
                  name={`scale-${current}`}
                  value={label}
                  checked={labels[current].scale === label}
                  onChange={e => handleSelect('scale', e.target.value)}
                  style={{ marginRight: 6 }}
                />
                {label}
              </label>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 18, flexWrap: 'wrap' }}>
            {['Unsure', 'Not Related'].map(label => (
              <label key={label} style={{ display: 'flex', alignItems: 'center', fontWeight: 400, minWidth: 90 }}>
                <input
                  type="radio"
                  name={`scale-${current}`}
                  value={label}
                  checked={labels[current].scale === label}
                  onChange={e => handleSelect('scale', e.target.value)}
                  style={{ marginRight: 6 }}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Prev / Submit / Next */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <button
            onClick={() => setCurrent(i => Math.max(0, i - 1))}
            disabled={current === 0}
            style={{ padding: '10px 22px', minHeight: 44, borderRadius: 6, background: current === 0 ? '#ccc' : '#1976d2', color: '#fff', border: 'none', fontWeight: 500, cursor: current === 0 ? 'not-allowed' : 'pointer' }}
          >
            Previous
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !labels.every(l => l.type && l.scale) || labelsSubmitted}
            style={{
              padding: '10px 22px',
              minHeight: 44,
              borderRadius: 6,
              background: labelsSubmitted ? '#ccc' : (labels.every(l => l.type && l.scale) ? '#388e3c' : '#ccc'),
              color: '#fff',
              border: 'none',
              fontWeight: 500,
              cursor: loading || !labels.every(l => l.type && l.scale) || labelsSubmitted ? 'not-allowed' : 'pointer',
              margin: '0 12px'
            }}
          >
            Submit
          </button>
          <button
            onClick={() => setCurrent(i => Math.min(posts.length - 1, i + 1))}
            disabled={current === posts.length - 1}
            style={{ padding: '10px 22px', minHeight: 44, borderRadius: 6, background: current === posts.length - 1 ? '#ccc' : '#1976d2', color: '#fff', border: 'none', fontWeight: 500, cursor: current === posts.length - 1 ? 'not-allowed' : 'pointer' }}
          >
            Next
          </button>
        </div>

        {submitStatus && (
          <div
            role={submitStatus.success ? 'status' : 'alert'}
            aria-live="polite"
            style={{ marginBottom: 12, color: submitStatus.success ? '#2e7d32' : '#a81318' }}
          >
            {submitStatus.message}
          </div>
        )}

        {/* Fetch new posts */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
          <button
            onClick={fetchUnlabelledPosts}
            disabled={loading || !labelsSubmitted}
            style={{
              padding: '10px 24px',
              minHeight: 44,
              borderRadius: 6,
              background: labelsSubmitted ? '#ff5722' : '#e0e0e0',
              color: '#fff',
              border: 'none',
              fontWeight: 500,
              cursor: loading || !labelsSubmitted ? 'not-allowed' : 'pointer',
              boxShadow: labelsSubmitted ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
              transition: 'background 0.3s ease',
            }}
          >
            {loading ? 'Loading…' : (labelsSubmitted ? 'Get New Unlabelled Posts' : 'Submit Labels First')}
          </button>
        </div>
      </div>
    </>
  );
}
