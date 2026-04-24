import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const palette = { accent: '#00d4ff', red: '#ff3860' };

export default function TrafficChart() {
  const labels24 = Array.from({length:24}, (_,i) => `${String(i).padStart(2,'0')}:00`);
  const rnd = (n, spread) => Array.from({length: n}, () => Math.round(Math.random() * spread));

  const data = {
    labels: labels24,
    datasets: [
      {
        label: 'Normal',
        data: rnd(24, 8000),
        borderColor: palette.accent,
        backgroundColor: 'rgba(0,212,255,.06)',
        fill: true,
        tension: 0.4,
        pointRadius: 2
      },
      {
        label: 'Malicious',
        data: rnd(24, 1500),
        borderColor: palette.red,
        backgroundColor: 'rgba(255,56,96,.06)',
        fill: true,
        tension: 0.4,
        pointRadius: 2
      }
    ]
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

  return <Line data={data} options={options} />;
}
