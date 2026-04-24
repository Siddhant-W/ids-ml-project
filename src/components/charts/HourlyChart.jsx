import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function HourlyChart() {
  const labels24 = Array.from({length:24}, (_,i) => `${String(i).padStart(2,'0')}:00`);
  const rnd = (n, spread) => Array.from({length: n}, () => Math.round(Math.random() * spread));

  const data = {
    labels: labels24,
    datasets: [{
      label: 'Attacks',
      data: rnd(24, 200),
      backgroundColor: 'rgba(255,56,96,.6)',
      borderRadius: 4
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#8899bb', font: { family: "'Space Mono', monospace", size: 11 }, boxWidth: 10 } }
    },
    scales: {
      x: { ticks: { color: '#4a5878', font: { size: 10, family: "'Space Mono', monospace" } }, grid: { color: 'rgba(30,42,69,.6)' } },
      y: { ticks: { color: '#4a5878', font: { size: 10, family: "'Space Mono', monospace" } }, grid: { color: 'rgba(30,42,69,.6)' } }
    }
  };

  return <Bar data={data} options={options} />;
}
