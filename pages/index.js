// export default function Test() {
//   return <div>Hello from index.js</div>
// }
import { useEffect, useState } from 'react';
import Chart from '../components/Chart';

// Helper: filter per-hour data to only the last 24 hours
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
      {/* Responsive meta tag for mobile */}
      <style>{`
        @media (max-width: 600px) {
          .dashboard-main { padding: 8px !important; }
          .dashboard-row { flex-direction: column !important; gap: 16px !important; }
          .dashboard-col { min-width: 0 !important; width: 100% !important; }
          .dashboard-title { font-size: 22px !important; }
          .dashboard-section { padding: 10px !important; }
        }
      `}</style>
      <main className="dashboard-main" style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
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
        <span>Last Updated: {stats.now}</span>
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
      <h2 style={{ margin: '18px 0 10px 0', fontWeight: 600, fontSize: 20, letterSpacing: '0.01em' }}>Timeline</h2>
      <ul style={{ margin: '0 0 18px 0', paddingLeft: 20, fontSize: 15, color: '#333', listStyle: 'disc inside' }}>
        <li><b>Data Collection</b> <span style={{ background: '#1976d2', color: '#fff', borderRadius: 6, padding: '2px 8px', fontSize: 12, marginLeft: 8 }}>Ongoing</span></li>
        <li>Data Labeling</li>
        <li>Model Building</li>
        <li>First Report on the Data and Model</li>
        <li>Call for Competitions</li>
        <li>Organize the Competition</li>
        <li>Report on the Competition Results</li>
      </ul>
    </main>
    </>
  );
}

