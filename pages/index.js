// export default function Test() {
//   return <div>Hello from index.js</div>
// }
import React, { useState, useEffect } from 'react';
import Chart from '../components/Chart';

// Helper: filter per-hour data to only the last 24 hours
// Helper: filter per-hour data to only the last 24 hours using system time
function getLast24Hours(data, nowStr) {
  if (!Array.isArray(data) || data.length === 0) return [];
  const now = nowStr ? new Date(nowStr) : new Date();
  const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  return data.filter(item => {
    const d = new Date(item.hour);
    return d >= cutoff && d <= now;
  });
}


export default function Home() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load stats');
        return res.json();
      })
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Unknown error');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return (
    <div style={{ color: 'red', padding: 24 }}>
      <h2>Error Loading Data</h2>
      <p>{error}</p>
      <p>
        Please ensure <code>stats.json</code> is present in the project root and the API is working.<br />
        If you just deployed, try redeploying after running your Python preprocessing script.
      </p>
    </div>
  );
  if (!stats || !stats.postsPerHour) return <div>No data available.</div>;

  return (
    <>
      {/* Top Bar with Login Button */}
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          overscroll-behavior: none;
        }
      `}</style>
      <div style={{ width: '100%', background: '#ce181e', color: '#fff', padding: '8px 0', margin: 0, textAlign: 'center', fontWeight: 600, fontSize: 18, letterSpacing: '0.5px', boxShadow: '0 2px 8px #eee', zIndex: 1000, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', minHeight: 48, position: 'fixed', top: 0, left: 0 }}>
        <button
          style={{ marginRight: 16, padding: '8px 18px', fontSize: 16, background: '#fff', color: '#ce181e', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, boxShadow: '0 1px 4px #bdbdbd' }}
          onClick={() => window.location.href = '/progress'}
        >
          Progress
        </button>
        <button
          style={{ marginRight: 32, padding: '8px 18px', fontSize: 16, background: '#fff', color: '#ce181e', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, boxShadow: '0 1px 4px #bdbdbd' }}
          onClick={() => window.location.href = '/login'}
        >
          Login
        </button>
      </div>
      {/* Responsive meta tag for mobile */}
      <style>{`
        @media (max-width: 600px) {
          .dashboard-main { padding: 8px !important; padding-top: 48px !important; }
          .dashboard-row { flex-direction: column !important; gap: 16px !important; }
          .dashboard-col { min-width: 0 !important; width: 100% !important; }
          .dashboard-title { font-size: 22px !important; }
          .dashboard-section { padding: 10px !important; }
          .ack-logo { height: 70px !important; }
        }
        .ack-logo { height: 150px; object-fit: contain; }
      `}</style>
      <main className="dashboard-main" style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: 24, minHeight: '100vh', paddingTop: 48 }}>
        <h1 className="dashboard-title" style={{ fontSize: 36, fontWeight: 'bold', marginBottom: 12, letterSpacing: '-0.5px' }}>
          Accelerating Universal Mental Health Access Through AI-Powered Suicide Prevention
        </h1>
      <section className="dashboard-section" style={{ marginBottom: 24, background: '#f6f8fa', borderRadius: 8, padding: 16, boxShadow: '0 1px 4px #eee' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 32, fontSize: 16, marginBottom: 6 }}>
          <span style={{ fontWeight: 'bold' }}>Lead:</span> <span style={{ fontWeight: 'normal', marginRight: 24 }}>
            <a href="https://ihozh.github.io/" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'none' }}>Yihe Zhang</a>
          </span>
          <span style={{ fontWeight: 'bold' }}>Advisor:</span> <span style={{ fontWeight: 'normal' }}>
            <a href="https://www.xialihei.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'none' }}>Xiali (Sharon) Hei</a>
          </span>
        </div>
        <div><b>Affiliation:</b> Informatics Research Institute, University of Louisiana at Lafayette</div>
        <div><b>Contact:</b> <a href="mailto:yihe.zhang@louisiana.edu">yihe.zhang@louisiana.edu</a></div>
      </section>
      <section style={{ marginBottom: 32 }}>
        <span>Last Updated: {new Date(stats.now).toLocaleString()}</span>
      </section>


      <h2 style={{ margin: '24px 0 14px 0', fontWeight: 600, fontSize: 20, letterSpacing: '0.01em' }}>Data Collection Progress (Live)</h2>
      <div className="dashboard-row" style={{ display: 'flex', flexDirection: 'row', gap: 32 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Posts Captured Per Hour</h3>
          <Chart
            data={getLast24Hours(stats.postsPerHour, stats.now)}
            label="Posts per hour"
          />
          <div style={{ fontSize: 15, color: '#444', marginTop: 8 }}>
            <b>Total posts (last 24h):</b> {getLast24Hours(stats.postsPerHour, stats.now).reduce((sum, d) => sum + d.count, 0)}
          </div>
          <div style={{ fontSize: 14, color: '#000', marginTop: 2 }}>
            <b>Total posts (all time):</b> {Array.isArray(stats.postsPerHour) ? stats.postsPerHour.reduce((sum, d) => sum + d.count, 0) : 0}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Comments Captured Per Hour</h3>
          <Chart
            data={getLast24Hours(stats.commentsPerHour, stats.now)}
            label="Comments per hour"
            color="rgba(54, 162, 235, 0.5)"
          />
          <div style={{ fontSize: 15, color: '#444', marginTop: 8 }}>
            <b>Total comments (last 24h):</b> {getLast24Hours(stats.commentsPerHour, stats.now).reduce((sum, d) => sum + d.count, 0)}
          </div>
          <div style={{ fontSize: 14, color: '#000', marginTop: 2 }}>
            <b>Total comments (all time):</b> {Array.isArray(stats.commentsPerHour) ? stats.commentsPerHour.reduce((sum, d) => sum + d.count, 0) : 0}
          </div>
        </div>
      </div>
      
      <h2 style={{ margin: '18px 0 10px 0', fontWeight: 600, fontSize: 20, letterSpacing: '0.01em' }}>Data Labeling</h2>
      <section className="dashboard-section" style={{ marginBottom: 24, background: '#f6f8fa', borderRadius: 8, padding: 16, boxShadow: '0 1px 4px #eee' }}>
        <div style={{ fontSize: 14, marginBottom: 10 }}>
          <span style={{ fontWeight: 'bold' }}>Advisor:</span> <span style={{ fontWeight: 'normal' }}>
            <a href="https://manyu26.github.io/daisolab/" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'none' }}>Dr. Manyu Li</a>
          </span>
        </div>
        {stats.labelingProgress ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontWeight: 'bold', fontSize: 15 }}>Progress:</span>
              <span style={{ fontSize: 14 }}>
                {stats.labelingProgress.labeled} / {stats.labelingProgress.total} posts labeled
                ({stats.labelingProgress.total > 0 
                  ? Math.round((stats.labelingProgress.labeled / stats.labelingProgress.total) * 100)
                  : 0}%)
              </span>
            </div>
            <div style={{ width: '100%', height: 16, background: '#e0e0e0', borderRadius: 8, overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: `${stats.labelingProgress.total > 0 
                    ? (stats.labelingProgress.labeled / stats.labelingProgress.total) * 100 
                    : 0}%`, 
                  background: '#4caf50',
                  borderRadius: 8,
                  transition: 'width 0.5s ease-in-out'
                }}
              />
            </div>
            <div style={{ fontSize: 14, color: '#666', marginTop: 8, fontStyle: 'italic' }}>
              Help us improve our dataset by <a href="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>logging in</a> and contributing to the labeling process.
            </div>
          </div>
        ) : (
          <div>Loading labeling progress...</div>
        )}
      </section>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: '18px 0 10px 0', fontWeight: 600, fontSize: 20, letterSpacing: '0.01em' }}>Timeline</h2>
        <a href="/progress" style={{ color: '#1976d2', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
          View Detailed Progress →
        </a>
      </div>
      <ul style={{ margin: '0 0 18px 0', paddingLeft: 20, fontSize: 15, color: '#333', listStyleType: 'none' }}>
        <li style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: 8 }}>•</span>
          <b>Data Collection</b>
          <span style={{ background: '#4caf50', color: '#fff', borderRadius: 6, padding: '2px 8px', fontSize: 12, marginLeft: 8 }}>Completed</span>
        </li>
        <li style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: 8 }}>•</span>
          <b>Data Labeling</b>
          <span style={{ background: '#1976d2', color: '#fff', borderRadius: 6, padding: '2px 8px', fontSize: 12, marginLeft: 8 }}>Ongoing</span>
        </li>
        <li style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: 8 }}>•</span>
          Model Building
        </li>
        <li style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: 8 }}>•</span>
          First Report on the Data and Model
        </li>
        <li style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: 8 }}>•</span>
          Call for Competitions
        </li>
        <li style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: 8 }}>•</span>
          Organize the Competition
        </li>
        <li style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: 8 }}>•</span>
          Report on the Competition Results
        </li>
      </ul>
      {/* Acknowledgement Subsection */}
      <h2 style={{ margin: '18px 0 10px 0', fontWeight: 600, fontSize: 20, letterSpacing: '0.01em' }}>Acknowledgement</h2>
      <section style={{ background: '#f6f8fa', borderRadius: 8, padding: '8px 16px 16px 16px', boxShadow: '0 1px 4px #eee', marginBottom: 24 }}>
        <div style={{ fontSize: 16, color: '#333', marginBottom: 16, marginTop: 0 }}>
          This project is supported by the Informatics Research Institute, University of Louisiana at Lafayette. Special thanks to all contributors and advisors.
        </div>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
          <img src="/ull.png" alt="ULL Logo" className="ack-logo" />
          <img src="/nsf.png" alt="NSF Logo" className="ack-logo" />
        </div>
      </section>
    </main>
    </>
  );
}

