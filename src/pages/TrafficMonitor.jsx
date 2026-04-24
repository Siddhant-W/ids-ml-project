import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { generatePacket } from '../utils/dataGenerators';
import { formatTimestamp } from '../utils/formatters';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const generateInitialPackets = () => Array.from({ length: 50 }, generatePacket);

export default function TrafficMonitor() {
  const [packets, setPackets] = useState(generateInitialPackets);
  const [filter, setFilter] = useState('');
  const [protocolFilter, setProtocolFilter] = useState('ALL');
  const [isPaused, setIsPaused] = useState(false);
  const [packetRate, setPacketRate] = useState(14500);
  const [selectedPacket, setSelectedPacket] = useState(null);

  // Chart state for live packet rate
  const [rateDataPoints, setRateDataPoints] = useState(Array.from({length:30}, () => 14000));
  
  // Static Bandwidth chart data
  const [bwInbound] = useState(Array.from({length:30}, () => Math.random() * 500 + 300));
  const [bwOutbound] = useState(Array.from({length:30}, () => Math.random() * 300 + 100));

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      // New packet simulation
      const newPacket = generatePacket();
      
      setPackets(prev => {
        const p = [newPacket, ...prev];
        return p.slice(0, 200);
      });

      // Update Live Rate counter and chart
      const newRate = Math.floor(Math.random() * 5000) + 12000;
      setPacketRate(newRate);
      
      setRateDataPoints(prev => {
        const next = [...prev, newRate];
        next.shift();
        return next;
      });

    }, 1500);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Derived filtered packets
  const filteredPackets = packets.filter(p => {
    const matchProto = protocolFilter === 'ALL' || p.proto === protocolFilter;
    const matchText = filter === '' || 
                      p.src.includes(filter) || 
                      p.dst.includes(filter) || 
                      p.proto.toLowerCase().includes(filter.toLowerCase());
    return matchProto && matchText;
  }).slice(0, 50);

  const handleExportCSV = () => {
    const csv = 'Timestamp,Source IP,Dest IP,Protocol,SrcPort,DstPort,Length,Classification\n' +
      filteredPackets.map(p => `${p.ts},${p.src},${p.dst},${p.proto},${p.sp},${p.dp},${p.len},${p.type}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cybersentinel-traffic-filtered.csv`;
    link.click();
  };

  const getBadgeVariant = (type) => {
    if (type === 'NORMAL') return 'normal';
    if (type.includes('DoS') || type.includes('Attack')) return 'critical';
    return 'high'; // Probe etc.
  };

  // Chart configuration for Live Rate
  const rateChartData = {
    labels: Array.from({length: 30}, (_,i) => i),
    datasets: [{
      label: 'Packets/s',
      data: rateDataPoints,
      borderColor: 'var(--accent)',
      backgroundColor: 'rgba(0, 212, 255, 0.1)',
      fill: true,
      tension: 0.1,
      pointRadius: 0
    }]
  };

  const bwChartData = {
    labels: Array.from({length: 30}, (_,i) => i),
    datasets: [
      {
        label: 'Inbound (Mbps)',
        data: bwInbound,
        borderColor: 'var(--green)',
        tension: 0.2,
        pointRadius: 0
      },
      {
        label: 'Outbound (Mbps)',
        data: bwOutbound,
        borderColor: 'var(--purple)',
        tension: 0.2,
        pointRadius: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 }, // Smooth live updates
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: { ticks: { color: 'var(--text-3)', font: { size: 10, family: 'var(--mono)' } }, grid: { color: 'var(--border-light)' } }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* FILTER BAR ROW */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
        <input 
          className="form-input" 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="🔍 Search IPs, Protocol..."
          style={{ width: '250px' }}
        />
        
        <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-card)', padding: '4px', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
          {['ALL', 'TCP', 'UDP', 'ICMP', 'HTTP'].map(p => (
            <div 
              key={p} 
              className={`role-chip ${protocolFilter === p ? 'selected' : ''}`}
              onClick={() => setProtocolFilter(p)}
              style={{ margin: 0 }}
            >
              {p}
            </div>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
          <button className="btn btn-ghost" onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? '▶ RESUME' : '⏸ PAUSE'}
          </button>
          <button className="btn btn-primary" onClick={handleExportCSV}>⬇ EXPORT CSV</button>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid-2">
        <Card title="Live Packet Rate">
          <div className="chart-wrap tall">
            <Line data={rateChartData} options={chartOptions} />
          </div>
        </Card>
        <Card title="Bandwidth Usage">
           <div className="chart-wrap tall">
            <Line data={bwChartData} options={chartOptions} />
          </div>
        </Card>
      </div>

      {/* PACKET TABLE */}
      <Card title={`Live Traffic Stream (↑ ${packetRate.toLocaleString()} pkt/s)`}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ color: 'var(--text-3)', fontFamily: 'var(--mono)', fontSize: '12px', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '12px 8px' }}>#</th>
                <th style={{ padding: '12px 8px' }}>Timestamp</th>
                <th style={{ padding: '12px 8px' }}>Src IP</th>
                <th style={{ padding: '12px 8px' }}>Dst IP</th>
                <th style={{ padding: '12px 8px' }}>Proto</th>
                <th style={{ padding: '12px 8px' }}>S.Port</th>
                <th style={{ padding: '12px 8px' }}>D.Port</th>
                <th style={{ padding: '12px 8px' }}>Length</th>
                <th style={{ padding: '12px 8px' }}>Classification</th>
                <th style={{ padding: '12px 8px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPackets.map((p, idx) => (
                <tr key={p.id} className="fade-in" style={{ borderBottom: '1px solid var(--border-light)', fontSize: '13px' }}>
                  <td style={{ padding: '12px 8px', color: 'var(--text-3)' }}>{p.id.substring(0,6)}</td>
                  <td style={{ padding: '12px 8px' }}>{p.ts}</td>
                  <td style={{ padding: '12px 8px', fontFamily: 'var(--mono)' }}>{p.src}</td>
                  <td style={{ padding: '12px 8px', fontFamily: 'var(--mono)' }}>{p.dst}</td>
                  <td style={{ padding: '12px 8px' }}>{p.proto}</td>
                  <td style={{ padding: '12px 8px' }}>{p.sp}</td>
                  <td style={{ padding: '12px 8px' }}>{p.dp}</td>
                  <td style={{ padding: '12px 8px' }}>{p.len} B</td>
                  <td style={{ padding: '12px 8px' }}>
                    <Badge label={p.type} variant={getBadgeVariant(p.type)} />
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => setSelectedPacket(p)}>
                      INSPECT
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPackets.length === 0 && (
                <tr><td colSpan="10" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-3)' }}>No packets match the filter criteria.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal 
        isOpen={!!selectedPacket} 
        onClose={() => setSelectedPacket(null)}
        title="Packet Inspection Details"
      >
        {selectedPacket && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Timestamp</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '13px' }}>{selectedPacket.ts}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Packet ID</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '13px' }}>{selectedPacket.id}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Source</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '13px' }}>{selectedPacket.src}:{selectedPacket.sp}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Destination</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '13px' }}>{selectedPacket.dst}:{selectedPacket.dp}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Protocol</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '13px' }}>{selectedPacket.proto}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Length</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '13px' }}>{selectedPacket.len} Bytes</div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Classification</div>
              <div style={{ marginTop: '4px' }}>
                <Badge label={selectedPacket.type} variant={getBadgeVariant(selectedPacket.type)} />
              </div>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
