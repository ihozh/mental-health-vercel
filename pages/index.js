import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Chart from '../components/Chart';
import RadarChart from '../components/RadarChart';
import Nav from '../components/Nav';

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
  const [selectedModels, setSelectedModels] = useState(['BERT-MHDash', 'RoBERTa-HA-MHDash', 'GPT-4o']);

  // All available models for radar chart
  const allBenchmarkModels = [
    { name: 'BERT-MHDash', accuracy: 73.33, precision: 60.59, recall: 73.33, f1: 66.16, highRiskRecall: 55.0, tau: 55.45, category: 'Fine-tuned' },
    { name: 'RoBERTa-HA-MHDash', accuracy: 76.0, precision: 62.62, recall: 76.0, f1: 68.5, highRiskRecall: 56.67, tau: 57.23, category: 'Fine-tuned' },
    { name: 'GPT-4o', accuracy: 52.67, precision: 33.89, recall: 35.11, f1: 32.68, highRiskRecall: 50.0, tau: 45.12, category: 'OpenAI' },
    { name: 'GPT-4o-mini', accuracy: 48.0, precision: 30.22, recall: 31.11, f1: 28.73, highRiskRecall: 46.67, tau: 42.34, category: 'OpenAI' },
    { name: 'GPT-3.5-turbo', accuracy: 45.33, precision: 24.88, recall: 26.65, f1: 23.98, highRiskRecall: 43.33, tau: 36.97, category: 'OpenAI' },
    { name: 'Llama-3.1-8B', accuracy: 36.0, precision: 21.56, recall: 22.22, f1: 18.89, highRiskRecall: 33.33, tau: 28.45, category: 'Meta' },
    { name: 'Llama-3.3-70B', accuracy: 50.0, precision: 32.44, recall: 33.33, f1: 30.56, highRiskRecall: 46.67, tau: 43.67, category: 'Meta' },
    { name: 'DeepSeek-V3', accuracy: 48.67, precision: 31.11, recall: 32.22, f1: 29.44, highRiskRecall: 43.33, tau: 41.23, category: 'DeepSeek' },
    { name: 'Qwen2.5-72B', accuracy: 46.0, precision: 28.89, recall: 30.0, f1: 27.22, highRiskRecall: 40.0, tau: 38.56, category: 'Alibaba' },
    { name: 'Gemini-2.0-Flash', accuracy: 44.67, precision: 27.56, recall: 28.89, f1: 26.11, highRiskRecall: 36.67, tau: 35.89, category: 'Google' },
  ];

  // Toggle model selection
  const toggleModelSelection = (modelName) => {
    setSelectedModels(prev => {
      if (prev.includes(modelName)) {
        return prev.filter(m => m !== modelName);
      } else if (prev.length < 5) {
        return [...prev, modelName];
      }
      return prev;
    });
  };

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


  if (loading) return (
    <div role="status" aria-live="polite" style={{ padding: 24 }}>
      Loading dashboard data…
    </div>
  );
  if (error) return (
    <div role="alert" style={{ color: '#a81318', padding: 24 }}>
      <h2>Data temporarily unavailable</h2>
      <p>Please try refreshing the page. If the problem persists, contact the team.</p>
    </div>
  );
  if (!stats || !stats.postsPerHour) return (
    <div role="status" style={{ padding: 24 }}>No data available.</div>
  );

  const labeledPct = stats.labelingProgress?.total > 0
    ? stats.labelingProgress.labeled / stats.labelingProgress.total
    : 0;

  return (
    <>
      <Head>
        <title>MHDash — Mental Health AI Benchmark</title>
      </Head>

      <Nav />

      <style>{`
        @media (max-width: 600px) {
          .dashboard-main    { padding: 8px !important; padding-top: 60px !important; }
          .dashboard-row     { flex-direction: column !important; gap: 16px !important; }
          .dashboard-col     { min-width: 0 !important; width: 100% !important; }
          .dashboard-title   { font-size: 22px !important; }
          .dashboard-section { padding: 10px !important; }
          .ack-logo          { height: 70px !important; }
          .sdg-row           { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
          .sdg-image         { max-width: 100% !important; margin-bottom: 12px !important; }
          .sdg-images-col    { flex: 0 0 auto !important; width: 100% !important; }
          .sdg-images        { justify-content: center !important; }
        }
        .ack-logo  { height: 150px; object-fit: contain; }
        .sdg-image { border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
      `}</style>

      <main className="dashboard-main" style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: 24, minHeight: '100vh', paddingTop: 60 }}>
        <h1 className="dashboard-title" style={{ fontSize: 36, fontWeight: 'bold', marginBottom: 12, letterSpacing: '-0.5px' }}>
          Accelerating Universal Mental Health Access Through AI-Powered Suicide Prevention
        </h1>

        <section className="dashboard-section" style={{ marginBottom: 24, background: '#f6f8fa', borderRadius: 8, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 16, marginBottom: 6, maxWidth: 560, margin: '0 auto' }}>
            <div>
              <strong>Lead:</strong>{' '}
              <a href="https://ihozh.github.io/" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'none' }}>Yihe Zhang</a>
            </div>
            <div>
              <strong>Advisor:</strong>{' '}
              <a href="https://www.xialihei.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'none' }}>Xiali (Sharon) Hei</a>
            </div>
          </div>
          <div><strong>Affiliation:</strong> Informatics Research Institute, University of Louisiana at Lafayette</div>
          <div><strong>Contact:</strong> <a href="mailto:yihe.zhang@louisiana.edu">yihe.zhang@louisiana.edu</a></div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <span>Last Updated: {new Date(stats.now).toLocaleString()}</span>
        </section>

        {/* Sustainable Development Goals Section */}
        <h2 style={{ margin: '18px 0 10px 0', fontWeight: 600, fontSize: 20, letterSpacing: '0.01em' }}>United Nations Sustainable Development Goals</h2>
        <section className="dashboard-section" style={{ marginBottom: 24, background: '#f6f8fa', borderRadius: 8, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <div className="sdg-row" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="sdg-images-col" style={{ flex: '0 0 320px' }}>
              <div className="sdg-images" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <img src="/SDG3.jpg"  alt="SDG 3: Good Health and Well-Being" className="sdg-image" style={{ width: 100, height: 'auto', objectFit: 'cover' }} />
                <img src="/SDG9.png"  alt="SDG 9: Industry, Innovation and Infrastructure" className="sdg-image" style={{ width: 100, height: 'auto', objectFit: 'cover' }} />
                <img src="/SDG17.png" alt="SDG 17: Partnerships for the Goals" className="sdg-image" style={{ width: 100, height: 'auto', objectFit: 'cover' }} />
              </div>
            </div>
            <div style={{ flex: 1, fontSize: 15, color: '#333' }}>
              <p style={{ margin: 0 }}>
                Learn more about the 2030 Agenda at{' '}
                <a href="https://sdgs.un.org" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'none' }}>sdgs.un.org</a>.
                <br />
                <strong>Goal 3:</strong> Detects early, prevents risk, and saves lives.
                <br />
                <strong>Goal 9:</strong> Robust pipelines for responsible, accessible mental health AI.
                <br />
                <strong>Goal 17:</strong> Opensource, collaborative mental health AI.
              </p>
            </div>
          </div>
        </section>

        <h2 style={{ margin: '24px 0 14px 0', fontWeight: 600, fontSize: 20, letterSpacing: '0.01em' }}>Data Collection Progress (Live)</h2>
        <div className="dashboard-row" style={{ display: 'flex', flexDirection: 'row', gap: 32 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Posts Captured Per Hour</h3>
            <Chart
              data={getLast24Hours(stats.postsPerHour, stats.now)}
              label="Posts per hour"
            />
            <div style={{ fontSize: 15, color: '#595959', marginTop: 8 }}>
              <strong>Total posts (last 24h):</strong> {getLast24Hours(stats.postsPerHour, stats.now).reduce((sum, d) => sum + d.count, 0)}
            </div>
            <div style={{ fontSize: 14, color: '#1a1a1a', marginTop: 2 }}>
              <strong>Total posts (all time):</strong> {Array.isArray(stats.postsPerHour) ? stats.postsPerHour.reduce((sum, d) => sum + d.count, 0) : 0}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Comments Captured Per Hour</h3>
            <Chart
              data={getLast24Hours(stats.commentsPerHour, stats.now)}
              label="Comments per hour"
              color="rgba(54, 162, 235, 0.5)"
            />
            <div style={{ fontSize: 15, color: '#595959', marginTop: 8 }}>
              <strong>Total comments (last 24h):</strong> {getLast24Hours(stats.commentsPerHour, stats.now).reduce((sum, d) => sum + d.count, 0)}
            </div>
            <div style={{ fontSize: 14, color: '#1a1a1a', marginTop: 2 }}>
              <strong>Total comments (all time):</strong> {Array.isArray(stats.commentsPerHour) ? stats.commentsPerHour.reduce((sum, d) => sum + d.count, 0) : 0}
            </div>
          </div>
        </div>

        <h2 style={{ margin: '18px 0 10px 0', fontWeight: 600, fontSize: 20, letterSpacing: '0.01em' }}>Data Labeling</h2>
        <section className="dashboard-section" style={{ marginBottom: 24, background: '#f6f8fa', borderRadius: 8, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 14, marginBottom: 10 }}>
            <strong>Advisor:</strong>{' '}
            <a href="https://manyu26.github.io/daisolab/" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'none' }}>Dr. Manyu Li</a>
          </div>
          {stats.labelingProgress ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontWeight: 'bold', fontSize: 15 }}>Progress:</span>
                <span style={{ fontSize: 14 }}>
                  {stats.labelingProgress.labeled} / {stats.labelingProgress.total} posts labeled
                  ({Math.round(labeledPct * 100)}%)
                </span>
              </div>
              {/* Progress bar: uses transform:scaleX to avoid animating layout property */}
              <div
                style={{ width: '100%', height: 16, background: '#e0e0e0', borderRadius: 8, overflow: 'hidden' }}
                role="progressbar"
                aria-valuenow={Math.round(labeledPct * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Data labeling progress"
              >
                <div style={{
                  height: '100%',
                  width: '100%',
                  background: '#4caf50',
                  borderRadius: 8,
                  transform: `scaleX(${labeledPct})`,
                  transformOrigin: 'left',
                  transition: 'transform 0.5s ease-out',
                }} />
              </div>
              <div style={{ fontSize: 14, color: '#595959', marginTop: 8, fontStyle: 'italic' }}>
                Help us improve our dataset by <a href="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>logging in</a> and contributing to the labeling process.
              </div>
            </div>
          ) : (
            <div role="status" aria-live="polite">Loading labeling progress…</div>
          )}
        </section>

        {/* Dataset Statistics */}
        <h2 style={{ margin: '18px 0 10px 0', fontWeight: 600, fontSize: 20, letterSpacing: '0.01em' }}>Dataset Statistics</h2>
        <section className="dashboard-section" style={{ marginBottom: 24, background: '#f6f8fa', borderRadius: 8, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <div className="dashboard-row" style={{ display: 'flex', flexDirection: 'row', gap: 32 }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', width: '100%' }}>
              {/* Type Distribution */}
              <div style={{ flex: '1 1 400px', minWidth: 300 }}>
                <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: '#333', textAlign: 'center' }}>Type Distribution</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', height: 40, borderRadius: 6, overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #ddd' }} role="img" aria-label="Type distribution bar: Ideation 61%, Behavior 25%, Attempt 6%, Support 5%, Indicator 3%">
                    <div style={{ background: '#ffcdd2', width: '61%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: 13, fontWeight: 600 }}>61%</div>
                    <div style={{ background: '#ffe0b2', width: '25%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: 13, fontWeight: 600 }}>25%</div>
                    <div style={{ background: '#f8bbd0', width: '6%',  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: 10, fontWeight: 600 }}>6%</div>
                    <div style={{ background: '#b2dfdb', width: '5%',  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: 10, fontWeight: 600 }}>5%</div>
                    <div style={{ background: '#fff9c4', width: '3%',  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: 9,  fontWeight: 600 }}>3%</div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
                    {[
                      { color: '#ffcdd2', label: 'Ideation (241)' },
                      { color: '#ffe0b2', label: 'Behavior (100)' },
                      { color: '#f8bbd0', label: 'Attempt (23)' },
                      { color: '#b2dfdb', label: 'Support (19)' },
                      { color: '#fff9c4', label: 'Indicator (12)' },
                    ].map(({ color, label }) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 16, height: 16, background: color, borderRadius: 3, border: '1px solid #ddd', flexShrink: 0 }} aria-hidden="true" />
                        <span style={{ fontSize: 12, fontWeight: 500 }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: 12, fontSize: 14, color: '#595959', fontWeight: 600, textAlign: 'center' }}>
                  Total: 395 labels
                </div>
              </div>

              {/* Scale Distribution */}
              <div style={{ flex: '1 1 400px', minWidth: 300 }}>
                <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: '#333', textAlign: 'center' }}>Scale Distribution</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', height: 40, borderRadius: 6, overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #ddd' }} role="img" aria-label="Scale distribution bar: Moderate 43%, Minor 36%, Severe 14%, No 7%">
                    <div style={{ background: '#ffe0b2', width: '43%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: 13, fontWeight: 600 }}>43%</div>
                    <div style={{ background: '#bbdefb', width: '36%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: 13, fontWeight: 600 }}>36%</div>
                    <div style={{ background: '#ffcdd2', width: '14%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: 11, fontWeight: 600 }}>14%</div>
                    <div style={{ background: '#b2dfdb', width: '7%',  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: 10, fontWeight: 600 }}>7%</div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
                    {[
                      { color: '#ffe0b2', label: 'Moderate (144)' },
                      { color: '#bbdefb', label: 'Minor (121)' },
                      { color: '#ffcdd2', label: 'Severe (45)' },
                      { color: '#b2dfdb', label: 'No (23)' },
                    ].map(({ color, label }) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 16, height: 16, background: color, borderRadius: 3, border: '1px solid #ddd', flexShrink: 0 }} aria-hidden="true" />
                        <span style={{ fontSize: 12, fontWeight: 500 }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: 12, fontSize: 14, color: '#595959', fontWeight: 600, textAlign: 'center' }}>
                  Total: 333 labels
                </div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16, padding: '12px 16px', fontSize: 14, color: '#595959', textAlign: 'center' }}>
            <strong>Dataset Access:</strong> Please contact the team for acquiring the dataset.{' '}
            <a href="/login?redirect=/dataset" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 600 }}>Login</a> to access download options.
          </div>
        </section>

        {/* Benchmark Summary Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: '18px 0 10px 0', fontWeight: 600, fontSize: 20, letterSpacing: '0.01em' }}>Benchmark Summary</h2>
          <a href="/benchmark" style={{ color: '#1976d2', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
            View Full Benchmark →
          </a>
        </div>
        <section className="dashboard-section" style={{ marginBottom: 24, background: '#f6f8fa', borderRadius: 8, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div style={{ flex: '1 1 350px', minWidth: 300 }}>
              <RadarChart
                models={allBenchmarkModels.filter(m => selectedModels.includes(m.name))}
              />
            </div>
            <div style={{ flex: '1 1 280px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 600, color: '#333' }}>Select Models to Compare (max 5)</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 16 }}>
                {allBenchmarkModels.map(model => {
                  const selected = selectedModels.includes(model.name);
                  const disabled = !selected && selectedModels.length >= 5;
                  return (
                    <button
                      key={model.name}
                      onClick={() => toggleModelSelection(model.name)}
                      disabled={disabled}
                      aria-pressed={selected}
                      style={{
                        padding: '10px 10px',
                        minHeight: 44,
                        fontSize: 12,
                        borderRadius: 4,
                        border: selected ? '2px solid #1976d2' : '1px solid #ccc',
                        background: selected ? '#e3f2fd' : '#fff',
                        color: selected ? '#1565c0' : '#595959',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        fontWeight: selected ? 600 : 400,
                        opacity: disabled ? 0.5 : 1,
                      }}
                    >
                      {model.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: '18px 0 10px 0', fontWeight: 600, fontSize: 20, letterSpacing: '0.01em' }}>Timeline</h2>
            <a href="/progress" style={{ color: '#1976d2', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
              View Detailed Progress →
            </a>
          </div>
          <ul style={{ margin: '0 0 18px 0', paddingLeft: 20, fontSize: 15, color: '#333', listStyleType: 'none' }}>
            {[
              { label: 'Data Collection',               status: 'Completed', color: '#4caf50' },
              { label: 'Data Labeling',                  status: 'Completed', color: '#4caf50' },
              { label: 'Benchmark Release',              status: 'Completed', color: '#4caf50' },
              { label: 'Model Building',                 status: 'Ongoing',   color: '#1976d2' },
              { label: 'First Report on the Data and Model', status: 'Ongoing', color: '#1976d2' },
              { label: 'Call for Competitions' },
              { label: 'Organize the Competition' },
              { label: 'Report on the Competition Results' },
            ].map(({ label, status, color }) => (
              <li key={label} style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: 8 }} aria-hidden="true">•</span>
                <strong>{label}</strong>
                {status && (
                  <span style={{ background: color, color: '#fff', borderRadius: 6, padding: '2px 8px', fontSize: 12, marginLeft: 8 }}>
                    {/* Icon provides redundant cue alongside color */}
                    {status === 'Completed' ? '✓ ' : '◷ '}{status}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* Acknowledgement */}
        <h2 style={{ margin: '18px 0 10px 0', fontWeight: 600, fontSize: 20, letterSpacing: '0.01em' }}>Acknowledgement</h2>
        <section style={{ background: '#f6f8fa', borderRadius: 8, padding: '8px 16px 16px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: 24 }}>
          <div style={{ fontSize: 16, color: '#333', marginBottom: 16, marginTop: 8 }}>
            This project is supported by the Informatics Research Institute, University of Louisiana at Lafayette. Special thanks to all contributors and advisors.
          </div>
          <div style={{ display: 'flex', gap: 32, alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
            <img src="/ull.png" alt="University of Louisiana at Lafayette logo" className="ack-logo" />
            <img src="/nsf.png" alt="National Science Foundation logo" className="ack-logo" />
          </div>
          <div style={{ display: 'flex', gap: 32, alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
            <img src="/UN.jpg" alt="United Nations logo" className="ack-logo" />
          </div>
        </section>

        {/* Visitor tracker */}
        <section style={{ marginBottom: 24, textAlign: 'center' }}>
          <div style={{ padding: '8px' }}>
            <a href="https://clustrmaps.com/site/1c8aw" title="Visit tracker">
              <img src="https://clustrmaps.com/map_v2.png?cl=ffffff&w=300&t=tt&d=hcDiYNu7KM_OeNEQ3UCpOxM522zFt6fVjMIcYNUJj4M" alt="Visitor map" />
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
