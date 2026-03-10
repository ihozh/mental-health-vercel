import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Nav from '../components/Nav';

export default function Dataset() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataset, setDataset] = useState(null);
  const [downloadFormat, setDownloadFormat] = useState('csv');

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
        if (!res.ok) throw new Error('Failed to fetch dataset information');
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
      if (!res.ok) throw new Error('Failed to download dataset');
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

  if (loading) return (
    <>
      <Head><title>Dataset | MHDash</title></Head>
      <Nav loggedIn onLogout={handleLogout} />
      <div role="status" aria-live="polite" style={{ padding: '80px 24px' }}>Loading…</div>
    </>
  );
  if (error) return (
    <>
      <Head><title>Dataset | MHDash</title></Head>
      <Nav loggedIn onLogout={handleLogout} />
      <div role="alert" style={{ color: '#a81318', padding: '80px 24px' }}>
        Data temporarily unavailable. Please try refreshing the page.
      </div>
    </>
  );

  return (
    <>
      <Head>
        <title>Dataset | MHDash</title>
      </Head>

      <Nav loggedIn onLogout={handleLogout} />

      <main style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: 24, minHeight: '100vh', paddingTop: 72 }}>
        <h1 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24, color: '#1a1a1a' }}>
          Labeled Dataset
        </h1>

        {/* Dataset Statistics */}
        <section style={{ marginBottom: 32, background: '#f6f8fa', borderRadius: 8, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Dataset Statistics</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div style={{ background: '#fff', padding: 16, borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: 14, color: '#595959', marginBottom: 4 }}>Total Labeled Posts</div>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#ce181e' }}>{dataset?.totalLabeled || 0}</div>
            </div>
            <div style={{ background: '#fff', padding: 16, borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: 14, color: '#595959', marginBottom: 4 }}>Unique Contributors</div>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#1976d2' }}>{dataset?.uniqueContributors || 0}</div>
            </div>
            <div style={{ background: '#fff', padding: 16, borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: 14, color: '#595959', marginBottom: 4 }}>Last Updated</div>
              <div style={{ fontSize: 16, fontWeight: 'bold', color: '#1a1a1a' }}>
                {dataset?.lastUpdated ? new Date(dataset.lastUpdated).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>
        </section>

        {/* Label Distribution */}
        {dataset?.labelDistribution && (
          <section style={{ marginBottom: 32, background: '#f6f8fa', borderRadius: 8, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
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
        <section style={{ marginBottom: 32, background: '#f6f8fa', borderRadius: 8, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Download Dataset</h2>
          <p style={{ marginBottom: 16, color: '#595959' }}>
            Download the complete labeled dataset in your preferred format. The dataset includes post content, labels, and contributor information.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <label htmlFor="format-select" style={{ marginRight: 8, fontWeight: 500 }}>Format:</label>
              <select
                id="format-select"
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
                minHeight: 44,
                background: '#4caf50',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 16,
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
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
