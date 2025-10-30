import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Dataset() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataset, setDataset] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState('csv');
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Check authentication
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const username = localStorage.getItem('username');
      if (!username || username.trim() === '') {
        router.replace('/login');
      }
    }
  }, [router]);

  // Fetch dataset statistics
  useEffect(() => {
    async function fetchDatasetInfo() {
      try {
        const res = await fetch('/api/dataset');
        if (!res.ok) {
          throw new Error('Failed to fetch dataset information');
        }
        const data = await res.json();
        setDataset(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    
    fetchDatasetInfo();
  }, []);

  const handleDownload = async () => {
    try {
      const res = await fetch(`/api/dataset?format=${downloadFormat}&download=true`);
      if (!res.ok) {
        throw new Error('Failed to download dataset');
      }
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mental_health_dataset.${downloadFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Error downloading dataset: ' + err.message);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('username');
      localStorage.removeItem('name');
      router.push('/');
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (error) return <div style={{ color: 'red', padding: 24 }}>Error: {error}</div>;

  return (
    <>
      <Head>
        <title>Dataset - Mental Health Dashboard</title>
      </Head>
      
      {/* Top Bar with Navigation */}
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
            Dashboard
          </button>
        </div>
        
        {/* Desktop Navigation */}
        <div className="desktop-nav" style={{ marginRight: 32, display: 'flex', gap: 16 }}>
          <button
            style={{ padding: '8px 18px', fontSize: 16, background: '#fff', color: '#ce181e', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, boxShadow: '0 1px 4px #bdbdbd' }}
            onClick={() => router.push('/participants')}
          >
            Participants
          </button>
          <button
            style={{ padding: '8px 18px', fontSize: 16, background: '#fff', color: '#ce181e', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, boxShadow: '0 1px 4px #bdbdbd' }}
            onClick={() => router.push('/progress')}
          >
            Progress
          </button>
          <button
            style={{ padding: '8px 18px', fontSize: 16, background: '#ce181e', color: '#fff', border: '2px solid #fff', borderRadius: 6, cursor: 'pointer', fontWeight: 600, boxShadow: '0 1px 4px #bdbdbd' }}
            onClick={() => router.push('/dataset')}
          >
            Dataset
          </button>
          <button
            style={{ padding: '8px 18px', fontSize: 16, background: '#fff', color: '#ce181e', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, boxShadow: '0 1px 4px #bdbdbd' }}
            onClick={handleLogout}
          >
            Logout
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
            <button className="mobile-menu-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>

      <main style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: 24, minHeight: '100vh', paddingTop: 72 }}>
        <h1 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>
          Labeled Dataset
        </h1>

        {/* Dataset Statistics */}
        <section style={{ marginBottom: 32, background: '#f6f8fa', borderRadius: 8, padding: 24, boxShadow: '0 1px 4px #eee' }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Dataset Statistics</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div style={{ background: '#fff', padding: 16, borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Total Labeled Posts</div>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#ce181e' }}>{dataset?.totalLabeled || 0}</div>
            </div>
            <div style={{ background: '#fff', padding: 16, borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Unique Contributors</div>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#1976d2' }}>{dataset?.uniqueContributors || 0}</div>
            </div>
            <div style={{ background: '#fff', padding: 16, borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Last Updated</div>
              <div style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
                {dataset?.lastUpdated ? new Date(dataset.lastUpdated).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>
        </section>

        {/* Label Distribution */}
        {dataset?.labelDistribution && (
          <section style={{ marginBottom: 32, background: '#f6f8fa', borderRadius: 8, padding: 24, boxShadow: '0 1px 4px #eee' }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Label Distribution</h2>
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Type (Box1)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Object.entries(dataset.labelDistribution.box1 || {}).map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 500 }}>{key}</span>
                    <span style={{ background: '#ce181e', color: '#fff', padding: '4px 12px', borderRadius: 4, fontSize: 14 }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Scale (Box2)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Object.entries(dataset.labelDistribution.box2 || {}).map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 500 }}>{key}</span>
                    <span style={{ background: '#1976d2', color: '#fff', padding: '4px 12px', borderRadius: 4, fontSize: 14 }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Download Section */}
        <section style={{ marginBottom: 32, background: '#f6f8fa', borderRadius: 8, padding: 24, boxShadow: '0 1px 4px #eee' }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Download Dataset</h2>
          <p style={{ marginBottom: 16, color: '#666' }}>
            Download the complete labeled dataset in your preferred format. The dataset includes post content, labels, and contributor information.
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <label style={{ marginRight: 8, fontWeight: 500 }}>Format:</label>
              <select 
                value={downloadFormat} 
                onChange={(e) => setDownloadFormat(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', fontSize: 14 }}
              >
                <option value="csv">CSV</option>
                <option value="json">JSON</option>
              </select>
            </div>
            
            <button
              onClick={handleDownload}
              style={{ 
                padding: '10px 24px', 
                background: '#4caf50', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 6, 
                cursor: 'pointer', 
                fontWeight: 600,
                fontSize: 16,
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              Download Dataset
            </button>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section style={{ background: '#fff3cd', borderRadius: 8, padding: 24, border: '1px solid #ffc107' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: '#856404' }}>Usage Guidelines</h2>
          <ul style={{ margin: 0, paddingLeft: 20, color: '#856404' }}>
            <li>This dataset is for research purposes only</li>
            <li>Please cite this project if you use the data in your research</li>
            <li>Respect privacy and ethical guidelines when working with mental health data</li>
            <li>Do not share or redistribute the dataset without permission</li>
          </ul>
        </section>
      </main>
    </>
  );
}
