import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function RadarChart({ models, title }) {
  // Metrics to display on the radar chart
  const metrics = ['Accuracy', 'Precision', 'Recall', 'F1', 'High Risk Recall', 'Kendall τ'];
  
  // Colors for different models
  const colors = [
    { bg: 'rgba(54, 162, 235, 0.2)', border: 'rgba(54, 162, 235, 1)' },
    { bg: 'rgba(255, 99, 132, 0.2)', border: 'rgba(255, 99, 132, 1)' },
    { bg: 'rgba(75, 192, 192, 0.2)', border: 'rgba(75, 192, 192, 1)' },
    { bg: 'rgba(255, 159, 64, 0.2)', border: 'rgba(255, 159, 64, 1)' },
    { bg: 'rgba(153, 102, 255, 0.2)', border: 'rgba(153, 102, 255, 1)' },
  ];

  const chartData = {
    labels: metrics,
    datasets: models.map((model, idx) => ({
      label: model.name,
      data: [
        model.accuracy,
        model.precision,
        model.recall,
        model.f1,
        model.highRiskRecall,
        model.tau || 0
      ],
      backgroundColor: colors[idx % colors.length].bg,
      borderColor: colors[idx % colors.length].border,
      borderWidth: 2,
      pointBackgroundColor: colors[idx % colors.length].border,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: colors[idx % colors.length].border,
    }))
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: { size: 12 }
        }
      },
      title: {
        display: !!title,
        text: title,
        font: { size: 16, weight: 'bold' }
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          font: { size: 10 }
        },
        pointLabels: {
          font: { size: 12, weight: 500 }
        }
      }
    }
  };

  return <Radar data={chartData} options={options} />;
}
