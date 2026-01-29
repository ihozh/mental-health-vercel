import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Participants() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Participants data
  const participants = [
    {
      name: 'Cheyenne N Mohawk',
      affiliation: 'University of Louisiana at Lafayette',
      role: 'Student'
    },
    {
      name: 'Kaiying Han',
      affiliation: 'University of Louisiana at Lafayette',
      role: 'Research Software Architect'
    },
    {
      name: 'Yihe Zhang',
      affiliation: 'University of Louisiana at Lafayette',
      role: 'Research Scientist'
    },
    {
      name: 'Vijay Srinivas Tida',
      affiliation: 'College of Saint Benedict and Saint John\'s University',
      role: 'Faculty'
    },
    {
      name: 'Manyu Li',
      affiliation: 'University of Louisiana at Lafayette',
      role: 'Faculty'
    },
    {
      name: 'Xiali Hei',
      affiliation: 'University of Louisiana at Lafayette',
      role: 'Faculty'
    }
  ];
  
  const loading = false;
  const error = null;
  
  // Toggle mobile menu
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
            .participants-main { padding: 12px !important; padding-top: 64px !important; }
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
      {/* Top Bar with Navigation Buttons */}
      <div style={{ width: '100%', background: '#ce181e', color: '#fff', padding: '8px 0', margin: 0, textAlign: 'center', fontWeight: 600, fontSize: 18, letterSpacing: '0.5px', boxShadow: '0 2px 8px #eee', zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 48, position: 'fixed', top: 0, left: 0 }}>
        <div style={{ marginLeft: 16 }}>
          <button
            style={{ padding: '8px 18px', fontSize: 16, background: '#fff', color: '#ce181e', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, boxShadow: '0 1px 4px #bdbdbd' }}
            onClick={() => router.push('/')}
          >
            Back to Dashboard
          </button>
        </div>
        
        {/* Desktop Navigation */}
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

      <main className="participants-main" style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: 24, minHeight: '100vh', paddingTop: 48 }}>
        <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#333' }}>
          Participants
        </h1>
        
        {loading ? (
          <div>Loading participants data...</div>
        ) : error ? (
          <div style={{ color: 'red', padding: 16, background: '#ffeeee', borderRadius: 4, marginBottom: 16 }}>
            <p><strong>Error:</strong> {error}</p>
            <p>The participants API endpoint may not be implemented yet.</p>
          </div>
        ) : (
          <>
            {participants.length === 0 ? (
              <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 4 }}>
                <p>No participants data available yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f2f2f2' }}>
                      <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
                      <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #ddd' }}>Role</th>
                      <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #ddd' }}>Affiliation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((participant, index) => (
                      <tr key={index} style={{ background: index % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
                        <td style={{ padding: 12, borderBottom: '1px solid #eee', fontWeight: 'bold' }}>{participant.name}</td>
                        <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{participant.role || 'N/A'}</td>
                        <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{participant.affiliation || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
        
      </main>
    </>
  );
}
