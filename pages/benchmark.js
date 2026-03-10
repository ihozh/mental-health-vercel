import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Nav from '../components/Nav';

// Maps model category to background color for badges
const CATEGORY_COLORS = {
  'Fine-tuned': '#e3f2fd',
  'OpenAI':     '#fce4ec',
  'Meta':       '#f3e5f5',
  'DeepSeek':   '#e8f5e9',
  'Alibaba':    '#fff3e0',
  'Google':     '#e8eaf6',
  'Mistral':    '#fce4ec',
};
function getCategoryBg(category) {
  return CATEGORY_COLORS[category] || '#f5f5f5';
}

export default function Benchmark() {
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

  // Accessible sortable table header: keyboard + aria-sort support
  const SortHeader = ({ label, sortKey }) => {
    const isActive = sortConfig.key === sortKey;
    const ariaSort = isActive
      ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending')
      : 'none';

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleSort(sortKey);
      }
    };

    return (
      <th
        scope="col"
        onClick={() => handleSort(sortKey)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        aria-sort={ariaSort}
        style={{
          padding: '12px 8px',
          textAlign: 'left',
          borderBottom: '2px solid #ce181e',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          background: '#f6f8fa',
          userSelect: 'none',
        }}
      >
        {label}{' '}
        {isActive
          ? (sortConfig.direction === 'desc' ? '▼' : '▲')
          : <span style={{ color: '#bbb', fontSize: 11 }}>↕</span>
        }
      </th>
    );
  };

  return (
    <>
      <Head>
        <title>Benchmark Results | MHDash</title>
      </Head>

      <Nav />

      <main style={{ width: '100%', maxWidth: 1200, margin: '0 auto', padding: 24, minHeight: '100vh', paddingTop: 64 }}>
        <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 8, color: '#1a1a1a' }}>
          LLM Benchmark Results
        </h1>
        <p style={{ color: '#595959', marginBottom: 24 }}>
          Evaluation of Large Language Models on Mental Health Classification Tasks
        </p>

        {loading ? (
          <div role="status" aria-live="polite" style={{ padding: 24, textAlign: 'center' }}>
            Loading benchmark data…
          </div>
        ) : !benchmarkData ? (
          <div role="alert" style={{ padding: 24, textAlign: 'center', color: '#a81318' }}>
            Data temporarily unavailable. Please try refreshing the page.
          </div>
        ) : (
          <>
            {/* Summary Cards — simplified, no left-border hero metric pattern */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
              <div style={{ background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <div style={{ fontSize: 13, color: '#595959', marginBottom: 4 }}>Total Models</div>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: '#ce181e' }}>{benchmarkData.summary.total_models}</div>
              </div>
              <div style={{ background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <div style={{ fontSize: 13, color: '#595959', marginBottom: 4 }}>Best Avg F1</div>
                <div style={{ fontSize: 20, fontWeight: 'bold', color: '#4caf50' }}>{benchmarkData.summary.best_performers.avg_f1.model}</div>
                <div style={{ fontSize: 13, color: '#595959' }}>{benchmarkData.summary.best_performers.avg_f1.value}%</div>
              </div>
              <div style={{ background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <div style={{ fontSize: 13, color: '#595959', marginBottom: 4 }}>Best Joint Accuracy</div>
                <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1976d2' }}>{benchmarkData.summary.best_performers.joint_accuracy.model}</div>
                <div style={{ fontSize: 13, color: '#595959' }}>{benchmarkData.summary.best_performers.joint_accuracy.value}%</div>
              </div>
              <div style={{ background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <div style={{ fontSize: 13, color: '#595959', marginBottom: 4 }}>Last Updated</div>
                <div style={{ fontSize: 16, fontWeight: 'bold', color: '#1a1a1a' }}>{new Date(benchmarkData.generated_at).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 0, borderBottom: '2px solid #eee' }} role="tablist" aria-label="Benchmark views">
              {[
                { key: 'summary', label: 'Summary',      activeColor: '#333',    borderColor: '#ce181e' },
                { key: 'concern', label: 'Concern Type', activeColor: '#1565c0', borderColor: '#1565c0' },
                { key: 'risk',    label: 'Risk Level',   activeColor: '#c62828', borderColor: '#c62828' },
              ].map(({ key, label, activeColor, borderColor }) => {
                const active = activeTab === key;
                return (
                  <button
                    key={key}
                    role="tab"
                    aria-selected={active}
                    aria-controls={`panel-${key}`}
                    id={`tab-${key}`}
                    onClick={() => setActiveTab(key)}
                    style={{
                      padding: '12px 24px',
                      minHeight: 44,
                      fontSize: 15,
                      fontWeight: 600,
                      background: active ? '#fff' : '#f6f8fa',
                      color: active ? activeColor : '#595959',
                      border: 'none',
                      borderBottom: active ? `3px solid ${borderColor}` : '3px solid transparent',
                      cursor: 'pointer',
                      marginBottom: -2,
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Summary Tab */}
            {activeTab === 'summary' && (
              <div
                id="panel-summary"
                role="tabpanel"
                aria-labelledby="tab-summary"
                style={{ background: '#fff', borderRadius: '0 0 8px 8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden', marginBottom: 32 }}
              >
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #eee', background: '#f6f8fa' }}>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Overall Performance Summary</h2>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: '#595959' }}>Click or press Enter on column headers to sort</p>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                      <tr>
                        <SortHeader label="Model"      sortKey="model" />
                        <SortHeader label="Category"   sortKey="category" />
                        <SortHeader label="Concern F1" sortKey="concern_f1" />
                        <SortHeader label="Risk F1"    sortKey="risk_f1" />
                        <SortHeader label="Joint Acc"  sortKey="joint_accuracy" />
                        <SortHeader label="Avg F1"     sortKey="avg_f1" />
                      </tr>
                    </thead>
                    <tbody>
                      {sortedModels.map((model, idx) => {
                        const isTop = model.metrics.avg_f1 === benchmarkData.summary.best_performers.avg_f1.value;
                        return (
                          <tr key={model.model} style={{ background: isTop ? '#e8f5e9' : idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee', fontWeight: 600 }}>
                              {model.model}
                              {isTop && <span style={{ marginLeft: 8, fontSize: 12, color: '#4caf50' }} aria-label="Best performer">★ Best</span>}
                            </td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee' }}>
                              <span style={{ padding: '4px 8px', borderRadius: 4, fontSize: 12, background: getCategoryBg(model.category), color: '#1a1a1a' }}>
                                {model.category}
                              </span>
                            </td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee' }}>{model.metrics.concern_type.f1.toFixed(2)}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee' }}>{model.metrics.risk_level.f1.toFixed(2)}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee' }}>{model.metrics.joint_accuracy.toFixed(2)}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee', fontWeight: 600, color: model.metrics.avg_f1 > 50 ? '#2e7d32' : model.metrics.avg_f1 > 30 ? '#e65100' : '#a81318' }}>
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
              <div
                id="panel-concern"
                role="tabpanel"
                aria-labelledby="tab-concern"
                style={{ background: '#fff', borderRadius: '0 0 8px 8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden', marginBottom: 32 }}
              >
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #eee', background: '#e3f2fd' }}>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#1565c0' }}>Concern Type Classification</h2>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: '#595959' }}>Click or press Enter on column headers to sort</p>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                      <tr>
                        <SortHeader label="Model"          sortKey="model" />
                        <SortHeader label="Category"       sortKey="category" />
                        <SortHeader label="Accuracy"       sortKey="concern_accuracy" />
                        <SortHeader label="Precision"      sortKey="concern_precision" />
                        <SortHeader label="Recall"         sortKey="concern_recall" />
                        <SortHeader label="F1"             sortKey="concern_f1" />
                        <SortHeader label="High Risk Recall" sortKey="concern_high_risk_recall" />
                        <SortHeader label="FNR"            sortKey="concern_fnr" />
                        <SortHeader label="Kendall τ"      sortKey="concern_kendall_tau" />
                      </tr>
                    </thead>
                    <tbody>
                      {sortedModels.map((model, idx) => {
                        const ct = model.metrics.concern_type;
                        return (
                          <tr key={model.model} style={{ background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee', fontWeight: 600 }}>{model.model}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee' }}>
                              <span style={{ padding: '4px 8px', borderRadius: 4, fontSize: 12, background: getCategoryBg(model.category), color: '#1a1a1a' }}>
                                {model.category}
                              </span>
                            </td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee' }}>{ct.accuracy?.toFixed(2) ?? '-'}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee' }}>{ct.precision?.toFixed(2) ?? '-'}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee' }}>{ct.recall?.toFixed(2) ?? '-'}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee', fontWeight: 600 }}>{ct.f1?.toFixed(2) ?? '-'}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee', color: ct.high_risk_recall > 50 ? '#2e7d32' : '#a81318' }}>{ct.high_risk_recall?.toFixed(2) ?? '-'}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee', color: ct.fnr < 50 ? '#2e7d32' : '#a81318' }}>{ct.fnr?.toFixed(2) ?? '-'}</td>
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
              <div
                id="panel-risk"
                role="tabpanel"
                aria-labelledby="tab-risk"
                style={{ background: '#fff', borderRadius: '0 0 8px 8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden', marginBottom: 32 }}
              >
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #eee', background: '#ffebee' }}>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#c62828' }}>Risk Level Classification</h2>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: '#595959' }}>Click or press Enter on column headers to sort</p>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                      <tr>
                        <SortHeader label="Model"          sortKey="model" />
                        <SortHeader label="Category"       sortKey="category" />
                        <SortHeader label="Accuracy"       sortKey="risk_accuracy" />
                        <SortHeader label="Precision"      sortKey="risk_precision" />
                        <SortHeader label="Recall"         sortKey="risk_recall" />
                        <SortHeader label="F1"             sortKey="risk_f1" />
                        <SortHeader label="High Risk Recall" sortKey="risk_high_risk_recall" />
                        <SortHeader label="FNR"            sortKey="risk_fnr" />
                        <SortHeader label="Kendall τ"      sortKey="risk_kendall_tau" />
                      </tr>
                    </thead>
                    <tbody>
                      {sortedModels.map((model, idx) => {
                        const rl = model.metrics.risk_level;
                        return (
                          <tr key={model.model} style={{ background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee', fontWeight: 600 }}>{model.model}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee' }}>
                              <span style={{ padding: '4px 8px', borderRadius: 4, fontSize: 12, background: getCategoryBg(model.category), color: '#1a1a1a' }}>
                                {model.category}
                              </span>
                            </td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee' }}>{rl.accuracy?.toFixed(2) ?? '-'}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee' }}>{rl.precision?.toFixed(2) ?? '-'}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee' }}>{rl.recall?.toFixed(2) ?? '-'}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee', fontWeight: 600 }}>{rl.f1?.toFixed(2) ?? '-'}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee', color: rl.high_risk_recall > 50 ? '#2e7d32' : '#a81318' }}>{rl.high_risk_recall?.toFixed(2) ?? '-'}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #eee', color: rl.fnr < 50 ? '#2e7d32' : '#a81318' }}>{rl.fnr?.toFixed(2) ?? '-'}</td>
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
