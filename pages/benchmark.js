import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Benchmark() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'avg_f1', direction: 'desc' });
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    fetch('/data/benchmark.json')
      .then(res => res.json())
      .then(data => {
        setBenchmarkData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load benchmark data:', err);
        setLoading(false);
      });
  }, []);

  const sortedModels = benchmarkData?.models ? [...benchmarkData.models].sort((a, b) => {
    let aVal, bVal;
    if (sortConfig.key === 'model' || sortConfig.key === 'category') {
      aVal = a[sortConfig.key];
      bVal = b[sortConfig.key];
    } else if (sortConfig.key === 'avg_f1' || sortConfig.key === 'joint_accuracy') {
      aVal = a.metrics[sortConfig.key];
      bVal = b.metrics[sortConfig.key];
    } else if (sortConfig.key.startsWith('concern_')) {
      const metric = sortConfig.key.replace('concern_', '');
      aVal = a.metrics.concern_type[metric];
      bVal = b.metrics.concern_type[metric];
    } else if (sortConfig.key.startsWith('risk_')) {
      const metric = sortConfig.key.replace('risk_', '');
      aVal = a.metrics.risk_level[metric];
      bVal = b.metrics.risk_level[metric];
    }
    if (typeof aVal === 'string') {
      return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
  }) : [];

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const SortHeader = ({ label, sortKey }) => (
    <th
      onClick={() => handleSort(sortKey)}
      style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '2px solid #ce181e', cursor: 'pointer', whiteSpace: 'nowrap', background: '#f6f8fa' }}
    >
      {label} {sortConfig.key === sortKey ? (sortConfig.direction === 'desc' ? '▼' : '▲') : ''}
    </th>
  );

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <Head>
        <style dangerouslySetInnerHTML={{ __html: `
          html, body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
          }
          @media (max-width: 600px) {
            .benchmark-main { padding: 12px !important; padding-top: 64px !important; }
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
        `}}/>
      </Head>

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
            onClick={() => router.push('/login')}
          >
            Login
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
            <button className="mobile-menu-button" onClick={() => router.push('/login')}>
              Login
            </button>
          </div>
        )}
      </div>

      <main className="benchmark-main" style={{ width: '100%', maxWidth: 1200, margin: '0 auto', padding: 24, minHeight: '100vh', paddingTop: 64 }}>
        <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 8, color: '#333' }}>
          LLM Benchmark Results
        </h1>
        <p style={{ color: '#666', marginBottom: 24 }}>
          Evaluation of Large Language Models on Mental Health Classification Tasks
        </p>

        {loading ? (
          <div style={{ padding: 24, textAlign: 'center' }}>Loading benchmark data...</div>
        ) : !benchmarkData ? (
          <div style={{ padding: 24, textAlign: 'center', color: '#d32f2f' }}>Failed to load benchmark data</div>
        ) : (
          <>
            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
              <div style={{ background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderLeft: '4px solid #ce181e' }}>
                <div style={{ fontSize: 14, color: '#666' }}>Total Models</div>
                <div style={{ fontSize: 32, fontWeight: 'bold', color: '#ce181e' }}>{benchmarkData.summary.total_models}</div>
              </div>
              <div style={{ background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderLeft: '4px solid #4caf50' }}>
                <div style={{ fontSize: 14, color: '#666' }}>Best Avg F1</div>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#4caf50' }}>{benchmarkData.summary.best_performers.avg_f1.model}</div>
                <div style={{ fontSize: 14, color: '#666' }}>{benchmarkData.summary.best_performers.avg_f1.value}%</div>
              </div>
              <div style={{ background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderLeft: '4px solid #1976d2' }}>
                <div style={{ fontSize: 14, color: '#666' }}>Best Joint Accuracy</div>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1976d2' }}>{benchmarkData.summary.best_performers.joint_accuracy.model}</div>
                <div style={{ fontSize: 14, color: '#666' }}>{benchmarkData.summary.best_performers.joint_accuracy.value}%</div>
              </div>
              <div style={{ background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderLeft: '4px solid #ff9800' }}>
                <div style={{ fontSize: 14, color: '#666' }}>Last Updated</div>
                <div style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>{new Date(benchmarkData.generated_at).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 0, borderBottom: '2px solid #eee' }}>
              <button
                onClick={() => setActiveTab('summary')}
                style={{
                  padding: '12px 24px',
                  fontSize: 15,
                  fontWeight: 600,
                  background: activeTab === 'summary' ? '#fff' : '#f6f8fa',
                  color: activeTab === 'summary' ? '#333' : '#666',
                  border: 'none',
                  borderBottom: activeTab === 'summary' ? '3px solid #ce181e' : '3px solid transparent',
                  cursor: 'pointer',
                  marginBottom: -2
                }}
              >
                Summary
              </button>
              <button
                onClick={() => setActiveTab('concern')}
                style={{
                  padding: '12px 24px',
                  fontSize: 15,
                  fontWeight: 600,
                  background: activeTab === 'concern' ? '#fff' : '#f6f8fa',
                  color: activeTab === 'concern' ? '#1565c0' : '#666',
                  border: 'none',
                  borderBottom: activeTab === 'concern' ? '3px solid #1565c0' : '3px solid transparent',
                  cursor: 'pointer',
                  marginBottom: -2
                }}
              >
                Concern Type
              </button>
              <button
                onClick={() => setActiveTab('risk')}
                style={{
                  padding: '12px 24px',
                  fontSize: 15,
                  fontWeight: 600,
                  background: activeTab === 'risk' ? '#fff' : '#f6f8fa',
                  color: activeTab === 'risk' ? '#c62828' : '#666',
                  border: 'none',
                  borderBottom: activeTab === 'risk' ? '3px solid #c62828' : '3px solid transparent',
                  cursor: 'pointer',
                  marginBottom: -2
                }}
              >
                Risk Level
              </button>
            </div>

            {/* Summary Tab */}
            {activeTab === 'summary' && (
              <div style={{ background: '#fff', borderRadius: '0 0 8px 8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden', marginBottom: 32 }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #eee', background: '#f6f8fa' }}>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Overall Performance Summary</h2>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: '#666' }}>Click column headers to sort</p>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                      <tr>
                        <SortHeader label="Model" sortKey="model" />
                        <SortHeader label="Category" sortKey="category" />
                        <SortHeader label="Concern F1" sortKey="concern_f1" />
                        <SortHeader label="Risk F1" sortKey="risk_f1" />
                        <SortHeader label="Joint Acc" sortKey="joint_accuracy" />
                        <SortHeader label="Avg F1" sortKey="avg_f1" />
                      </tr>
                    </thead>
                    <tbody>
                      {sortedModels.map((model, idx) => {
                        const isTopPerformer = model.metrics.avg_f1 === benchmarkData.summary.best_performers.avg_f1.value;
                        return (
                          <tr key={model.model} style={{ background: isTopPerformer ? '#e8f5e9' : idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee', fontWeight: 600 }}>
                              {model.model}
                              {isTopPerformer && <span style={{ marginLeft: 8, fontSize: 12, color: '#4caf50' }}>★ Best</span>}
                            </td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee' }}>
                              <span style={{ 
                                padding: '4px 8px', 
                                borderRadius: 4, 
                                fontSize: 12, 
                                background: model.category === 'Fine-tuned' ? '#e3f2fd' : 
                                           model.category === 'OpenAI' ? '#fce4ec' : 
                                           model.category === 'Meta' ? '#f3e5f5' : 
                                           model.category === 'DeepSeek' ? '#e8f5e9' : 
                                           model.category === 'Alibaba' ? '#fff3e0' : 
                                           model.category === 'Google' ? '#e8f5e9' : 
                                           model.category === 'Mistral' ? '#fce4ec' : '#f5f5f5',
                                color: '#333'
                              }}>
                                {model.category}
                              </span>
                            </td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee' }}>{model.metrics.concern_type.f1.toFixed(2)}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee' }}>{model.metrics.risk_level.f1.toFixed(2)}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee' }}>{model.metrics.joint_accuracy.toFixed(2)}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee', fontWeight: 600, color: model.metrics.avg_f1 > 50 ? '#4caf50' : model.metrics.avg_f1 > 30 ? '#ff9800' : '#d32f2f' }}>
                              {model.metrics.avg_f1.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Concern Type Tab */}
            {activeTab === 'concern' && (
              <div style={{ background: '#fff', borderRadius: '0 0 8px 8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden', marginBottom: 32 }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #eee', background: '#e3f2fd' }}>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#1565c0' }}>Concern Type Classification</h2>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: '#666' }}>Click column headers to sort</p>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                      <tr>
                        <SortHeader label="Model" sortKey="model" />
                        <SortHeader label="Category" sortKey="category" />
                        <SortHeader label="Accuracy" sortKey="concern_accuracy" />
                        <SortHeader label="Precision" sortKey="concern_precision" />
                        <SortHeader label="Recall" sortKey="concern_recall" />
                        <SortHeader label="F1" sortKey="concern_f1" />
                        <SortHeader label="High Risk Recall" sortKey="concern_high_risk_recall" />
                        <SortHeader label="FNR" sortKey="concern_fnr" />
                        <SortHeader label="Kendall τ" sortKey="concern_kendall_tau" />
                      </tr>
                    </thead>
                    <tbody>
                      {sortedModels.map((model, idx) => {
                        const ct = model.metrics.concern_type;
                        return (
                          <tr key={model.model} style={{ background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee', fontWeight: 600 }}>{model.model}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee' }}>
                              <span style={{ 
                                padding: '4px 8px', 
                                borderRadius: 4, 
                                fontSize: 12, 
                                background: model.category === 'Fine-tuned' ? '#e3f2fd' : 
                                           model.category === 'OpenAI' ? '#fce4ec' : 
                                           model.category === 'Meta' ? '#f3e5f5' : 
                                           model.category === 'DeepSeek' ? '#e8f5e9' : 
                                           model.category === 'Alibaba' ? '#fff3e0' : 
                                           model.category === 'Google' ? '#e8f5e9' : 
                                           model.category === 'Mistral' ? '#fce4ec' : '#f5f5f5',
                                color: '#333'
                              }}>
                                {model.category}
                              </span>
                            </td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee' }}>{ct.accuracy?.toFixed(2) ?? '-'}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee' }}>{ct.precision?.toFixed(2) ?? '-'}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee' }}>{ct.recall?.toFixed(2) ?? '-'}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee', fontWeight: 600 }}>{ct.f1?.toFixed(2) ?? '-'}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee', color: ct.high_risk_recall > 50 ? '#4caf50' : '#d32f2f' }}>{ct.high_risk_recall?.toFixed(2) ?? '-'}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee', color: ct.fnr < 50 ? '#4caf50' : '#d32f2f' }}>{ct.fnr?.toFixed(2) ?? '-'}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee' }}>{ct.kendall_tau?.toFixed(4) ?? '-'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Risk Level Tab */}
            {activeTab === 'risk' && (
              <div style={{ background: '#fff', borderRadius: '0 0 8px 8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden', marginBottom: 32 }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #eee', background: '#ffebee' }}>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#c62828' }}>Risk Level Classification</h2>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: '#666' }}>Click column headers to sort</p>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                      <tr>
                        <SortHeader label="Model" sortKey="model" />
                        <SortHeader label="Category" sortKey="category" />
                        <SortHeader label="Accuracy" sortKey="risk_accuracy" />
                        <SortHeader label="Precision" sortKey="risk_precision" />
                        <SortHeader label="Recall" sortKey="risk_recall" />
                        <SortHeader label="F1" sortKey="risk_f1" />
                        <SortHeader label="High Risk Recall" sortKey="risk_high_risk_recall" />
                        <SortHeader label="FNR" sortKey="risk_fnr" />
                        <SortHeader label="Kendall τ" sortKey="risk_kendall_tau" />
                      </tr>
                    </thead>
                    <tbody>
                      {sortedModels.map((model, idx) => {
                        const rl = model.metrics.risk_level;
                        return (
                          <tr key={model.model} style={{ background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee', fontWeight: 600 }}>{model.model}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee' }}>
                              <span style={{ 
                                padding: '4px 8px', 
                                borderRadius: 4, 
                                fontSize: 12, 
                                background: model.category === 'Fine-tuned' ? '#e3f2fd' : 
                                           model.category === 'OpenAI' ? '#fce4ec' : 
                                           model.category === 'Meta' ? '#f3e5f5' : 
                                           model.category === 'DeepSeek' ? '#e8f5e9' : 
                                           model.category === 'Alibaba' ? '#fff3e0' : 
                                           model.category === 'Google' ? '#e8f5e9' : 
                                           model.category === 'Mistral' ? '#fce4ec' : '#f5f5f5',
                                color: '#333'
                              }}>
                                {model.category}
                              </span>
                            </td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee' }}>{rl.accuracy?.toFixed(2) ?? '-'}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee' }}>{rl.precision?.toFixed(2) ?? '-'}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee' }}>{rl.recall?.toFixed(2) ?? '-'}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee', fontWeight: 600 }}>{rl.f1?.toFixed(2) ?? '-'}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee', color: rl.high_risk_recall > 50 ? '#4caf50' : '#d32f2f' }}>{rl.high_risk_recall?.toFixed(2) ?? '-'}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee', color: rl.fnr < 50 ? '#4caf50' : '#d32f2f' }}>{rl.fnr?.toFixed(2) ?? '-'}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee' }}>{rl.kendall_tau?.toFixed(4) ?? '-'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </>
        )}
      </main>
    </>
  );
}
