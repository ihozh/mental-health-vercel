import React from 'react';
import Head from 'next/head';
import Nav from '../components/Nav';

const url = 'https://mhdash.socialshields.org';

const projectLogs = [
  {
    date: '2026-03-18',
    title: 'Participating in CLPsych 2026 Shared Task',
    description: 'We are participating in the CLPsych 2026 Shared Task.',
    link: 'https://clpsych.org/shared-task/',
    linkText: 'CLPsych 2026 Shared Task',
  },
  {
    date: '2026-03-14',
    title: 'Presented at IEEE SoutheastCon 2026',
    description: 'Presented MHDash work at IEEE SoutheastCon 2026 in Huntsville, Alabama.',
    link: 'https://ieeesoutheastcon.org/',
    linkText: 'IEEE SoutheastCon',
  },
  {
    date: '2026-01-29',
    title: 'Benchmark Release (January 2026)',
    description: 'Initial release of the LLM benchmark featuring 15 models, evaluating performance on mental health classification tasks including concern type and risk level assessment.',
  },
  {
    date: '2026-01-29',
    title: 'Paper Accepted at IEEE SoutheastCon 2026',
    description: 'We are thrilled to announce that our paper "MHDash: An Online Platform for Benchmarking Mental Health–Aware AI Assistants" has been accepted!',
  },
  {
    date: '2025-10-30',
    title: 'Complete API v1.0',
    description: 'Fetch dataset for credentialed users',
  },
  {
    date: '2025-10-26',
    title: 'Data Labeling Completed',
  },
  {
    date: '2025-09-28',
    title: 'Data Collection Expanded',
    description: 'We started monitoring autism, ADHD, and PTSD-related social posts',
  },
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

const formatDate = (dateString) => {
  if (!dateString) return 'TBD';
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export default function ProjectProgress() {
  return (
    <>
      <Head>
        <title>Technical Log | MHDash</title>
      </Head>

      <Nav />

      <style>{`
        @media (max-width: 600px) {
          .progress-main { padding: 12px !important; padding-top: 64px !important; }
          .log-date      { width: 80px !important; }
        }
      `}</style>

      <main className="progress-main" style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: 24, minHeight: '100vh', paddingTop: 64 }}>
        <h1 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#1a1a1a' }}>
          Technical Log
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {projectLogs.map((log, index) => (
            <div key={index} style={{
              border: '1px solid #eee',
              borderRadius: 4,
              overflow: 'hidden',
              borderLeft: '3px solid #ddd',
            }}>
              <div style={{
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'flex-start',
                borderBottom: '1px solid #eee',
                background: index % 2 === 0 ? '#ffffff' : '#f9f9f9'
              }}>
                <div className="log-date" style={{
                  color: '#595959',
                  fontSize: 14,
                  fontWeight: 500,
                  width: '100px',
                  flexShrink: 0,
                }}>
                  {formatDate(log.date)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#333' }}>
                    {log.title}
                    {log.title === 'Project is now live at ' && log.link && (
                      <a href={log.link} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline', marginLeft: 4 }}>
                        {log.link}
                      </a>
                    )}
                  </h2>
                  {log.description && (
                    <div style={{ fontSize: 14, color: '#595959', marginTop: 4 }}>{log.description}</div>
                  )}
                  {log.link && log.title !== 'Project is now live at ' && (
                    <div style={{ marginTop: 4 }}>
                      <a href={log.link} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline', fontSize: 14 }}>
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
          <p style={{ margin: 0, fontSize: 13, color: '#595959' }}>
            Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </main>
    </>
  );
}
