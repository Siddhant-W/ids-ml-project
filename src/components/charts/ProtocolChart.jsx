import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ProtocolChart() {
  const data = {
    labels: ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'DNS', 'SSH', 'FTP'],
    datasets: [{
      label: 'Packets (K)',
      data: [42, 28, 15, 35, 51, 12, 8, 3],
      backgroundColor: ['rgba(0,212,255,.7)', 'rgba(0,136,255,.7)', 'rgba(156,110,255,.7)', 'rgba(0,230,118,.7)', 'rgba(0,212,255,.5)', 'rgba(255,214,0,.7)', 'rgba(255,140,66,.7)', 'rgba(255,56,96,.7)'],
      borderRadius: 4
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: '#4a5878', font: { size: 10, family: "'Space Mono', monospace" } }, grid: { color: 'rgba(30,42,69,.6)' } },
      y: { ticks: { color: '#4a5878', font: { size: 10, family: "'Space Mono', monospace" } }, grid: { color: 'rgba(30,42,69,.6)' } }
    }
  };

  return <Bar data={data} options={options} />;
}
