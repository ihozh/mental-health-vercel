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
  const [labelsSubmitted, setLabelsSubmitted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Simple auth check: redirect if no username in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('username')) {
      router.replace('/login');
    }
  }, [router]);

  // Get username and name from localStorage
  const username = (typeof window !== 'undefined') ? localStorage.getItem('username') : '';
  const name = (typeof window !== 'undefined') ? localStorage.getItem('name') : username;

  // Load initial posts
  useEffect(() => {
    // Load unlabelled posts on initial render
    fetchUnlabelledPosts();
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
    setLoading(true); // Set loading state when submission starts
    
    try {
      // Check if all posts have been labeled
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
            hash: post.post_hash,
            box1: labels[i].type,
            box2: labels[i].scale
          })),
          username
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setSubmitStatus({ success: true, message: 'Labels submitted successfully!' });
        setLabelsSubmitted(true); // Enable the reload button
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
      setLoading(false); // Always reset loading state when done
    }
  }
  
  // Function to fetch new unlabelled posts
  async function fetchUnlabelledPosts() {
    setLoading(true);
    setError(null);
    setSubmitStatus(null);
    setLabelsSubmitted(false);
    
    try {
      const username = localStorage.getItem('username');
      const res = await fetch(`/api/unlabelled_posts?username=${encodeURIComponent(username)}`);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch unlabelled posts');
      }
      
      const data = await res.json();
      
      if (data.posts && data.posts.length > 0) {
        setPosts(data.posts);
        // Reset labels for new posts
        setLabels(data.posts.map(() => ({ type: '', scale: '' })));
        // Reset to first post
        setCurrent(0);
        setSubmitStatus({ success: true, message: 'New unlabelled posts loaded!' });
      } else {
        // This is not an error, just informational
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
      router.replace('/login');
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
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

        <div className="desktop-nav" style={{ marginRight: 32 }}>
          <button
            style={{ marginRight: 16, padding: '8px 18px', fontSize: 16, background: '#fff', color: '#ce181e', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, boxShadow: '0 1px 4px #bdbdbd' }}
            onClick={() => router.push('/benchmark')}
          >
            Benchmark
          </button>
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
            style={{ marginRight: 16, padding: '8px 18px', fontSize: 16, background: '#fff', color: '#ce181e', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, boxShadow: '0 1px 4px #bdbdbd' }}
            onClick={() => router.push('/publication')}
          >
            Publication
          </button>
          <button
            style={{ padding: '8px 18px', fontSize: 16, background: '#fff', color: '#ce181e', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, boxShadow: '0 1px 4px #bdbdbd' }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <div className="mobile-nav-toggle" style={{ marginRight: 16, display: 'none' }}>
          <button
            onClick={toggleMobileMenu}
            style={{ padding: '8px 12px', fontSize: 16, background: '#fff', color: '#ce181e', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, boxShadow: '0 1px 4px #bdbdbd' }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu">
            <button className="mobile-menu-button" onClick={() => router.push('/benchmark')}>
              Benchmark
            </button>
            <button className="mobile-menu-button" onClick={() => router.push('/participants')}>
              Participants
            </button>
            <button className="mobile-menu-button" onClick={() => router.push('/progress')}>
              Progress
            </button>
            <button className="mobile-menu-button" onClick={() => router.push('/dataset')}>
              Dataset
            </button>
            <button className="mobile-menu-button" onClick={() => router.push('/publication')}>
              Publication
            </button>
            <button className="mobile-menu-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>

      <div style={{ maxWidth: 600, margin: '64px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8, position: 'relative' }}>
      <h2>Labeling Page</h2>
      <div style={{ marginBottom: 16, fontSize: '16px', color: '#333' }}>
        Hello, {name || username}!
      </div>
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
      {/* Radio button selections for Type and Scale */}
      {/* Type selections */}
      <div style={{ marginBottom: 18, background: '#e3f2fd', padding: '12px 16px', borderRadius: 8, border: '1.5px solid #90caf9' }}>
        <div style={{ fontWeight: 500, marginBottom: 4 }}>Suicide Type:</div>
        {/* Type selection in two rows, aligned */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: 18, marginBottom: 8 }}>
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
        <div style={{ display: 'flex', flexDirection: 'row', gap: 18, marginBottom: 12 }}>
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
      </div>
      
      {/* Scale selections */}
      <div style={{ marginBottom: 18, background: '#fce4ec', padding: '12px 16px', borderRadius: 8, border: '1.5px solid #f48fb1' }}>
        <div style={{ fontWeight: 500, marginBottom: 4 }}>Risk Scale:</div>
        {/* Scale selection in two rows, aligned */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: 18, marginBottom: 8 }}>
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
        <div style={{ display: 'flex', flexDirection: 'row', gap: 18, marginBottom: 12 }}>
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
          disabled={loading || !(labels.every(l => l.type && l.scale)) || labelsSubmitted}
          style={{
            padding: '8px 22px',
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
          style={{ padding: '8px 22px', borderRadius: 6, background: current === posts.length - 1 ? '#ccc' : '#1976d2', color: '#fff', border: 'none', fontWeight: 500, cursor: current === posts.length - 1 ? 'not-allowed' : 'pointer' }}
        >
          Next
        </button>
      </div>

      {/* Optionally, show submission status */}
      {submitStatus && <div style={{ marginBottom: 12, color: submitStatus.success ? 'green' : 'red' }}>{submitStatus.message}</div>}

      {/* Button to fetch new unlabelled posts */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
        <button
          onClick={fetchUnlabelledPosts}
          disabled={loading || !labelsSubmitted}
          style={{
            padding: '10px 24px',
            borderRadius: 6,
            background: labelsSubmitted ? '#ff5722' : '#e0e0e0',
            color: '#fff',
            border: 'none',
            fontWeight: 500,
            cursor: loading || !labelsSubmitted ? 'not-allowed' : 'pointer',
            boxShadow: labelsSubmitted ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          {loading ? 'Loading...' : (labelsSubmitted ? 'Get New Unlabelled Posts' : 'Submit Labels First')}
        </button>
      </div>

    </div>
    </>
  );
}
