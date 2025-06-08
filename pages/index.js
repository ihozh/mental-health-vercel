export default function Test() {
  return <div>Hello from index.js</div>
}
// import { useEffect, useState } from 'react';
// import Chart from '../components/Chart';

// export default function Home() {
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetch('/api/stats')
//       .then(res => {
//         if (!res.ok) throw new Error('Failed to load stats');
//         return res.json();
//       })
//       .then(data => {
//         setStats(data);
//         setLoading(false);
//       })
//       .catch(err => {
//         setError(err.message || 'Unknown error');
//         setLoading(false);
//       });
//   }, []);

//   if (loading) return <div>Loading...</div>;
//   if (error) return (
//     <div style={{ color: 'red', padding: 24 }}>
//       <h2>Error Loading Data</h2>
//       <p>{error}</p>
//       <p>
//         Please ensure <code>stats.json</code> is present in the project root and the API is working.<br />
//         If you just deployed, try redeploying after running your Python preprocessing script.
//       </p>
//     </div>
//   );
//   if (!stats || !stats.postsPerHour) return <div>No data available.</div>;

//   return (
//     <main style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
//       <h1>Reddit Data Capture Dashboard</h1>
//       <section style={{ marginBottom: 32 }}>
//         <b>Project Timeline:</b> <br />
//         <span>Start: {stats.projectStart}</span><br />
//         <span>Now: {stats.now}</span>
//       </section>
//       <section>
//         <h2>Posts Captured Per Hour</h2>
//         <Chart data={stats.postsPerHour} label="Posts per hour" />
//       </section>
//       <section style={{ marginTop: 40 }}>
//         <h2>Comments Captured Per Hour</h2>
//         <Chart data={stats.commentsPerHour} label="Comments per hour" color="rgba(54, 162, 235, 0.5)" />
//       </section>
//     </main>
//   );
// }

