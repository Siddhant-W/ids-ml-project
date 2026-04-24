import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AttackPieChart() {
  const data = {
    labels: ['DoS / DDoS', 'Probe / Scan', 'R2L Attack', 'U2R Attack'],
    datasets: [{
      data: [41, 28, 17, 14],
      backgroundColor: ['rgba(255,56,96,.8)', 'rgba(255,140,66,.8)', 'rgba(156,110,255,.8)', 'rgba(255,214,0,.8)'],
      borderWidth: 0,
      hoverOffset: 8
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    cutout: '68%'
  };

  return <Doughnut data={data} options={options} />;
}
