import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const url = 'https://mhdash.socialshields.org';

export default function ProjectProgress() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Project logs with dates - only showing completed or ongoing items in reverse chronological order (newest first)
  const projectLogs = [
    {
      date: '2025-08-28',
      title: 'Project is now live at ',
      link: url
    },
    {
      date: '2025-08-28',
      title: 'Integrating ICD-11'
    },
    {
      date: '2025-08-27',
      title: 'Honored with the Louisiana Impact Award',
      description: 'Our project has been honored with the Louisiana Impact Award. We sincerely thank the University of Louisiana at Lafayette for this recognition.',
      link: 'https://louisiana.edu/graduateschool/news/university-louisiana-lafayette-announces-round-4-research-award-recipients',
      linkText: 'news link'
    },
    {
      date: '2025-07-22',
      title: 'Start Building Knowledge Base'
    },
    {
      date: '2025-07-07',
      title: 'Data Labeling Started'
    },
    {
        date: '2025-07-07',
        title: 'Website Development Version 1.1',
        description: 'Develop progress page, add label progress bar'
      },
    {
      date: '2025-07-05',
      title: 'Post Selection Completed',
      description: '1000 posts selected for data labeling, according to clustering method and active learning method'
    },
    {
      date: '2025-06-08',
      title: 'Website Development Version 1.0',
      description: 'Initial version of the project website'
    },
    {
      date: '2025-06-03',
      title: 'Data Collection Started'
    }
  ];

  // Format date for display - including year
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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
            .progress-main { padding: 12px !important; padding-top: 64px !important; }
            .log-header { flex-direction: row !important; }
            .log-date { width: 80px !important; }
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
            style={{ padding: '8px 18px', fontSize: 16, background: '#fff', color: '#ce181e', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, boxShadow: '0 1px 4px #bdbdbd' }}
            onClick={() => window.location.href = '/login'}
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
            <button className="mobile-menu-button" onClick={() => router.push('/participants')}>
              Participants
            </button>
            <button className="mobile-menu-button" onClick={() => router.push('/progress')}>
              Progress
            </button>
            <button className="mobile-menu-button" onClick={() => window.location.href = '/login'}>
              Login
            </button>
          </div>
        )}
      </div>
      {/* Responsive styles moved to Head component */}
      <main className="progress-main" style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: 24, minHeight: '100vh', paddingTop: 64 }}>
        <h1 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#333' }}>
          Technical Log
        </h1>
        

        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {projectLogs.map((log, index) => (
            <div key={index} style={{ 
              border: '1px solid #eee', 
              borderRadius: 4, 
              overflow: 'hidden',
              borderLeft: '3px solid #ddd',
              marginBottom: 8
            }}>
              {/* Log header */}
              <div className="log-header" style={{ 
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid #eee',
                background: index % 2 === 0 ? '#ffffff' : '#f9f9f9'
              }}>
                <div className="log-date" style={{ 
                  color: '#666', 
                  fontSize: 14,
                  fontWeight: 500,
                  width: '100px',
                  flexShrink: 0
                }}>
                  {formatDate(log.date)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#333' }}>
                    {log.title}
                    {log.title === 'Project is now live at ' && log.link && (
                      <a href={log.link} target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc', textDecoration: 'underline', marginLeft: 4 }}>
                        {log.link}
                      </a>
                    )}
                  </h2>
                  {log.description && (
                    <div style={{ fontSize: 14, color: '#666', marginTop: 4 }}>{log.description}</div>
                  )}
                  {log.link && log.title !== 'Project is now live at ' && (
                    <div style={{ marginTop: 4 }}>
                      <a href={log.link} target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc', textDecoration: 'underline', fontSize: 16 }}>
                        {log.linkText || log.link}
                      </a>
                    </div>
                  )}
                </div>
              </div>
              

            </div>
          ))}
        </div>
        
        <div style={{ marginTop: 24, padding: 12, borderTop: '1px solid #eee', textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: 13, color: '#888' }}>
            Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </main>
    </>
  );
}
