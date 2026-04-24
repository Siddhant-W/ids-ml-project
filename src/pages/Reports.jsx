import React from 'react';
import Card from '../components/ui/Card';
import { useToast } from '../context/ToastContext';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function Reports() {
  const { addToast } = useToast();

  const handleExportPDF = () => addToast("Generating PDF report...", "info");
  const handleExportCSV = () => {
    const csv = "Date,TotalIncidents,Blocked,FalsePositives\n2023-10-01,105,95,2";
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cybersentinel-report.csv`;
    link.click();
    addToast("CSV Export Started", "success");
  };

  const chartData = {
    labels: Array.from({length: 30}, (_,i) => `Day ${i+1}`),
    datasets: [
      {
        label: 'Total Incidents',
        data: Array.from({length:30}, () => Math.random() * 200 + 50),
        borderColor: 'rgba(0,212,255,1)',
        backgroundColor: 'rgba(0,212,255,0.1)',
        fill: false,
        tension: 0.3
      },
      {
        label: 'Blocked Threats',
        data: Array.from({length:30}, () => Math.random() * 190 + 40),
        borderColor: 'rgba(0,230,118,1)',
        backgroundColor: 'rgba(0,230,118,0.1)',
        fill: true,
        tension: 0.3
      },
      {
        label: 'False Positives',
        data: Array.from({length:30}, () => Math.random() * 10 + 1),
        borderColor: 'rgba(255,140,66,1)',
        backgroundColor: 'rgba(255,140,66,0.1)',
        fill: false,
        tension: 0.3
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#8899bb', font: { family: "'Space Mono', monospace" } } }
    },
    scales: {
      x: { ticks: { color: '#4a5878' }, grid: { display: false } },
      y: { ticks: { color: '#4a5878' }, grid: { color: 'rgba(30,42,69,.6)' } }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Card 
        title="30-Day Security Summary"
        actionLabel="⬇ EXPORT CSV"
        action={handleExportCSV}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <button className="btn btn-ghost" onClick={handleExportPDF} style={{ marginRight: '12px' }}>📄 EXPORT PDF</button>
        </div>
        <div className="chart-wrap" style={{ height: '350px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </Card>

      <div className="grid-3">
        <div className="stat-card" style={{ borderTop: '3px solid var(--accent)' }}>
          <div className="stat-title">Total Incidents</div>
          <div className="stat-value" style={{ color: 'var(--accent)' }}>3,063</div>
          <div className="stat-sub">Last 30 Days</div>
        </div>
        <div className="stat-card" style={{ borderTop: '3px solid var(--green)' }}>
          <div className="stat-title">Blocked</div>
          <div className="stat-value" style={{ color: 'var(--green)' }}>2,841</div>
          <div className="stat-sub">92.7% Mitigation Rate</div>
        </div>
        <div className="stat-card" style={{ borderTop: '3px solid var(--orange)' }}>
          <div className="stat-title">Avg Response Time</div>
          <div className="stat-value" style={{ color: 'var(--orange)' }}>1.4s</div>
          <div className="stat-sub">Automated Defense Payload</div>
        </div>
      </div>
    </div>
  );
}
