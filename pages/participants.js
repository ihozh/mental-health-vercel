import React from 'react';
import Head from 'next/head';
import Nav from '../components/Nav';

const participants = [
  { name: 'Finn Mohawk',    affiliation: 'University of Louisiana at Lafayette',                  role: 'Student' },
  { name: 'Kaiying Han',          affiliation: 'University of Louisiana at Lafayette',                  role: 'Research Software Architect' },
  { name: 'Yihe Zhang',           affiliation: 'University of Louisiana at Lafayette',                  role: 'Research Scientist' },
  { name: 'Vijay Srinivas Tida',  affiliation: "College of Saint Benedict and Saint John's University", role: 'Faculty' },
  { name: 'Manyu Li',             affiliation: 'University of Louisiana at Lafayette',                  role: 'Faculty' },
  { name: 'Xiali Hei',            affiliation: 'University of Louisiana at Lafayette',                  role: 'Faculty' },
];

export default function Participants() {
  return (
    <>
      <Head>
        <title>Participants | MHDash</title>
      </Head>

      <Nav />

      <style>{`
        @media (max-width: 600px) {
          .participants-main { padding: 12px !important; padding-top: 64px !important; }
        }
      `}</style>

      <main className="participants-main" style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: 24, minHeight: '100vh', paddingTop: 64 }}>
        <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#1a1a1a' }}>
          Participants
        </h1>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f2f2f2' }}>
              <th scope="col" style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
              <th scope="col" style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #ddd' }}>Role</th>
              <th scope="col" style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #ddd' }}>Affiliation</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p, index) => (
              <tr key={index} style={{ background: index % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
                <td style={{ padding: 12, borderBottom: '1px solid #eee', fontWeight: 'bold' }}>{p.name}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{p.role || 'N/A'}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{p.affiliation || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
}
