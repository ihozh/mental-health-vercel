import { useEffect, useState } from 'react';
import Chart from '../components/Chart';

export default function Home() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1>Reddit Data Capture Dashboard</h1>
      <div style={{ marginBottom: 32 }}>
        <b>Project Timeline:</b> <br />
        <span>Start: {stats.projectStart}</span><br />
        <span>Now: {stats.now}</span>
      </div>
      <h2>Posts Captured Per Hour</h2>
      <Chart data={stats.postsPerHour} label="Posts per hour" />
      <h2 style={{ marginTop: 40 }}>Comments Captured Per Hour</h2>
      <Chart data={stats.commentsPerHour} label="Comments per hour" color="rgba(54, 162, 235, 0.5)" />
    </div>
  );
}
