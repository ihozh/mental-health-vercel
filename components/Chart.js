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
    labels: data.map(d => d.hour),
    datasets: [
      {
        label,
        data: data.map(d => d.count),
        backgroundColor: color || 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };
  return <Bar data={chartData} />;
}
