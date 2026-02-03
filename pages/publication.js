import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Publication() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            .publication-main { padding: 12px !important; padding-top: 64px !important; }
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

      <main className="publication-main" style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: 24, minHeight: '100vh', paddingTop: 64 }}>
        <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#333' }}>
          Publication
        </h1>
        <div style={{ background: '#f6f8fa', borderRadius: 8, padding: 16, boxShadow: '0 1px 4px #eee' }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
              MHDash: An Online Platform for Benchmarking Mental Health–Aware AI Assistants
            </div>
            <div style={{ fontSize: 14, color: '#333', marginBottom: 4 }}>
              Yihe Zhang, Cheyenne N Mohawk, Kaiying Han, Vijay Srinivas Tida, Manyu Li, Xiali Hei
            </div>
            <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
              In SoutheastCon, IEEE, 2026
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="https://huggingface.co/datasets/IkeZhang/MHDialog" target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: '#1976d2', textDecoration: 'none' }}>
                📊 Dataset
              </a>
              <a href="https://arxiv.org/abs/2602.00353" target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: '#1976d2', textDecoration: 'none' }}>
                📄 Paper
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
