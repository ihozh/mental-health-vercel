import React from 'react';
import Head from 'next/head';
import Nav from '../components/Nav';

export default function Publication() {
  return (
    <>
      <Head>
        <title>Publication | MHDash</title>
      </Head>

      <Nav />

      <style>{`
        @media (max-width: 600px) {
          .publication-main { padding: 12px !important; padding-top: 64px !important; }
        }
      `}</style>

      <main className="publication-main" style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: 24, minHeight: '100vh', paddingTop: 64 }}>
        <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#1a1a1a' }}>
          Publication
        </h1>
        <div style={{ background: '#f6f8fa', borderRadius: 8, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
              MHDash: An Online Platform for Benchmarking Mental Health–Aware AI Assistants
            </div>
            <div style={{ fontSize: 14, color: '#1a1a1a', marginBottom: 4 }}>
              Yihe Zhang, Finn Mohawk, Kaiying Han, Vijay Srinivas Tida, Manyu Li, Xiali Hei
            </div>
            <div style={{ fontSize: 14, color: '#595959', marginBottom: 8 }}>
              In SoutheastCon, IEEE, 2026
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="https://huggingface.co/datasets/IkeZhang/MHDialog" target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: '#1976d2', textDecoration: 'none' }}>
                Dataset
              </a>
              <a href="https://arxiv.org/abs/2602.00353" target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: '#1976d2', textDecoration: 'none' }}>
                Paper (arXiv)
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
