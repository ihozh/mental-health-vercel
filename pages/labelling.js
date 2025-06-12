import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Labelling() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [current, setCurrent] = useState(0);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Simple auth check: redirect if no username in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('username')) {
      router.replace('/login');
    }
  }, [router]);

  // Get username from localStorage
  const username = (typeof window !== 'undefined') ? localStorage.getItem('username') : '';

  useEffect(() => {
    fetch('/api/random_posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts);
        setLabels(data.posts.map(() => ({ type: '', scale: '' })));
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load posts');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!posts.length) return <div>No posts available.</div>;

  const handleSelect = (field, value) => {
    setLabels(labels => {
      const newLabels = [...labels];
      newLabels[current][field] = value;
      return newLabels;
    });
  };

  async function handleSubmit() {
    setSubmitStatus(null);
    try {
      const res = await fetch('/api/submit_labels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          labels: posts.map((post, i) => ({
            hash: post.post_hash,
            box1: labels[i].type,
            box2: labels[i].scale
          })),
          username
        })
      });
      if (res.ok) {
        setSubmitStatus({ success: true, message: 'Labels submitted successfully!' });
      } else {
        const err = await res.json();
        setSubmitStatus({ success: false, message: err.error || 'Submission failed.' });
      }
    } catch (err) {
      setSubmitStatus({ success: false, message: err.message || 'Submission failed.' });
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '64px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Labelling Page</h2>
      {/* Index of all 30 posts */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 16 }}>
        {posts.map((_, idx) => {
          const labeled = labels[idx]?.type && labels[idx]?.scale;
          let bg = '#eee', color = '#333', fontWeight = 'normal';
          if (idx === current) {
            bg = '#1976d2'; color = '#fff'; fontWeight = 'bold';
          } else if (labeled) {
            bg = '#333'; color = '#fff';
          }
          return (
            <span key={idx} style={{
              display: 'inline-block',
              width: 22,
              height: 22,
              textAlign: 'center',
              lineHeight: '22px',
              borderRadius: '50%',
              background: bg,
              color,
              fontWeight,
              cursor: 'pointer'
            }} onClick={() => setCurrent(idx)}>{idx + 1}</span>
          );
        })}
      </div>
      {/* Show current post */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Post #{current + 1}</div>
        <div style={{ whiteSpace: 'pre-line', marginBottom: 10 }}>{posts[current].title}</div>
        <div style={{ color: '#555', marginBottom: 10 }}>{posts[current].body}</div>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>Created: {new Date(posts[current].created).toLocaleString()}</div>
      </div>
      {/* Select boxes */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
        <div>
          <label htmlFor='type-select' style={{ fontWeight: 500 }}>Type: </label>
          <select
            id='type-select'
            value={labels[current].type}
            onChange={e => handleSelect('type', e.target.value)}
            style={{ marginLeft: 6 }}
          >
            <option value=''>Select</option>
            {[1,2,3,4].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor='scale-select' style={{ fontWeight: 500 }}>Scale: </label>
          <select
            id='scale-select'
            value={labels[current].scale}
            onChange={e => handleSelect('scale', e.target.value)}
            style={{ marginLeft: 6 }}
          >
            <option value=''>Select</option>
            {[1,2,3,4].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      </div>
      {/* Prev/Next buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <button
          onClick={() => setCurrent(i => Math.max(0, i - 1))}
          disabled={current === 0}
          style={{ padding: '8px 22px', borderRadius: 6, background: current === 0 ? '#ccc' : '#1976d2', color: '#fff', border: 'none', fontWeight: 500, cursor: current === 0 ? 'not-allowed' : 'pointer' }}
        >
          Previous
        </button>
        <button
          onClick={handleSubmit}
          disabled={!labels.every(l => l.type && l.scale)}
          style={{ padding: '8px 22px', borderRadius: 6, background: labels.every(l => l.type && l.scale) ? '#388e3c' : '#ccc', color: '#fff', border: 'none', fontWeight: 500, cursor: labels.every(l => l.type && l.scale) ? 'pointer' : 'not-allowed', margin: '0 12px' }}
        >
          Submit
        </button>
        <button
          onClick={() => setCurrent(i => Math.min(posts.length - 1, i + 1))}
          disabled={current === posts.length - 1}
          style={{ padding: '8px 22px', borderRadius: 6, background: current === posts.length - 1 ? '#ccc' : '#1976d2', color: '#fff', border: 'none', fontWeight: 500, cursor: current === posts.length - 1 ? 'not-allowed' : 'pointer' }}
        >
          Next
        </button>
      </div>

      {/* Optionally, show submission status */}
      {submitStatus && <div style={{ marginBottom: 12, color: submitStatus.success ? 'green' : 'red' }}>{submitStatus.message}</div>}

    </div>
  );
}
