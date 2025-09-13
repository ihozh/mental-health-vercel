import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Participants() {
  const router = useRouter();
  
  // Participants data
  const participants = [
    {
      name: 'Cheyenne N Mohawk',
      affiliation: 'University of Louisiana at Lafayette'
    }
  ];
  
  const loading = false;
  const error = null;

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
          }
        `}}/>
      </Head>
      {/* Top Bar with Navigation Buttons */}
      <div style={{ width: '100%', background: '#ce181e', color: '#fff', padding: '8px 0', margin: 0, textAlign: 'center', fontWeight: 600, fontSize: 18, letterSpacing: '0.5px', boxShadow: '0 2px 8px #eee', zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 48, position: 'fixed', top: 0, left: 0 }}>
        <div style={{ marginLeft: 32 }}>
          <button
            style={{ padding: '8px 18px', fontSize: 16, background: '#fff', color: '#ce181e', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, boxShadow: '0 1px 4px #bdbdbd' }}
            onClick={() => router.push('/')}
          >
            Back to Dashboard
          </button>
        </div>
        <div style={{ marginRight: 32 }}>
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
            onClick={() => router.push('/login')}
          >
            Login
          </button>
        </div>
      </div>

      <main className="participants-main" style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: 24, minHeight: '100vh', paddingTop: 48 }}>
        <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#333' }}>
          Student Participants
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
                      <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #ddd' }}>Affiliation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((participant, index) => (
                      <tr key={index} style={{ background: index % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
                        <td style={{ padding: 12, borderBottom: '1px solid #eee', fontWeight: 'bold' }}>{participant.name}</td>
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
