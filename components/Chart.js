import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Chart({ data, label, color }) {
  const chartData = {
    labels: data.map(d => {
      const label = d.hour || d.day;
      // Remove year: '2025-06-08T14:00' => '06-08 14' or '06-08' for day
      if (label.length >= 13) {
        // Hourly: '2025-06-08T14:00' => '06-08 14'
        return label.slice(5, 10) + ' ' + label.slice(11, 13);
      } else if (label.length >= 10) {
        // Daily: '2025-06-08' => '06-08'
        return label.slice(5, 10);
      } else {
        return label;
      }
    }),
    datasets: [
      {
        label,
        data: data.map(d => d.count),
        backgroundColor: color || 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          callback: function(value, index, ticks) {
            // Show every 4th label for hourly data (labels like '06-08 00', '06-08 04', ...)
            const label = this.getLabelForValue(value);
            // If label is in 'MM-DD HH' format, only show every 4th hour
            if (/\d{2}-\d{2} \d{2}/.test(label)) {
              const hour = parseInt(label.slice(-2), 10);
              return hour % 4 === 0 ? label : '';
            }
            // For daily or other labels, show all
            return label;
          }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
