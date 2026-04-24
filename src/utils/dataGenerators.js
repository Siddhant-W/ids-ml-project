export const SEVERITY_LEVELS = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

export const ATTACK_TYPES = [
  'DoS — SYN Flood', 'Port Scan — Probe', 'Brute Force SSH', 'HTTP Flood',
  'DNS Amplification', 'ICMP Flood', 'U2R Escalation', 'R2L Access'
];

export const PROTOCOLS = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'DNS', 'SSH'];

export const generateAlert = () => {
  const types = [
    {type:'DoS — SYN Flood',sev:'CRITICAL',proto:'TCP',sport:'*',dport:'80'},
    {type:'Port Scan — Probe',sev:'HIGH',proto:'TCP',sport:'*',dport:'22'},
    {type:'Brute Force SSH',sev:'HIGH',proto:'TCP',sport:'*',dport:'22'},
    {type:'HTTP Flood',sev:'HIGH',proto:'HTTP',sport:'*',dport:'443'},
    {type:'DNS Amplification',sev:'MEDIUM',proto:'UDP',sport:'*',dport:'53'},
    {type:'ICMP Flood',sev:'MEDIUM',proto:'ICMP',sport:'*',dport:'*'},
    {type:'U2R Escalation',sev:'CRITICAL',proto:'SSH',sport:'*',dport:'22'},
    {type:'R2L Access',sev:'HIGH',proto:'FTP',sport:'*',dport:'21'},
  ];
  const ips = ['45.33.32.156','203.0.113.14','198.51.100.7','192.0.2.100','10.0.2.55','192.168.12.44'];
  const pick = types[Math.floor(Math.random()*types.length)];
  const src = ips[Math.floor(Math.random()*ips.length)];
  return {
    id: 'ALT-' + String(Math.floor(Math.random()*90000)+10000),
    ts: new Date().toLocaleTimeString('en-US',{hour12:false}),
    sev: pick.sev,
    type: pick.type,
    src,
    dst: '10.0.0.' + Math.floor(Math.random()*50+1),
    proto: pick.proto,
    status: Math.random() > 0.3 ? 'BLOCKED' : 'DETECTED',
  };
};

export const generatePacket = () => {
  const ips = ['192.168.1.'+Math.floor(Math.random()*254+1), '10.0.0.'+Math.floor(Math.random()*50+1), '203.0.113.'+Math.floor(Math.random()*100), '45.33.'+Math.floor(Math.random()*100)+'.'+Math.floor(Math.random()*255)];
  const proto = PROTOCOLS[Math.floor(Math.random()*PROTOCOLS.length)];
  const isMalicious = Math.random() < 0.12;
  return {
    id: 'PKT-' + String(Math.floor(Math.random()*90000)+10000),
    ts: new Date().toLocaleTimeString('en-US',{hour12:false}),
    src: ips[Math.floor(Math.random()*ips.length)],
    dst: ips[Math.floor(Math.random()*ips.length)],
    proto,
    sp: Math.floor(Math.random()*65000+1),
    dp: [80,443,22,21,53,8080,3389][Math.floor(Math.random()*7)],
    len: Math.floor(Math.random()*1400+40),
    type: isMalicious ? (Math.random()<0.5?'DoS':'Probe') : 'NORMAL',
  };
};

export const generateSparkData = (count, max) => {
  return Array.from({length: count}, () => Math.round(Math.random() * max));
};
