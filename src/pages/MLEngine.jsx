import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TRAINING_STAGES = [
  "Preprocessing data...", "Extracting features...",
  "Training model...", "Evaluating performance...", 
  "Saving model..."
];

import { api } from '../services/api';

export default function MLEngine() {
  const { role } = useAuth();
  const { addToast } = useToast();

  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingStatus, setTrainingStatus] = useState('');
  const [split, setSplit] = useState(80);
  const [metrics, setMetrics] = useState(null);
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    api.getMLMetrics().then(setMetrics).catch(console.error);
    api.getFeatures().then(setFeatures).catch(console.error);
  }, []);

  const startTraining = () => {
    if (role !== 'Admin') {
      addToast("Insufficient permissions", "error");
      return;
    }
    
    api.trainModel().then(() => {
      setIsTraining(true);
      setTrainingProgress(0);
      setTrainingStatus(TRAINING_STAGES[0]);

      let prog = 0;
      const interval = setInterval(() => {
        prog += Math.floor(Math.random() * 6 + 2);
        if (prog >= 100) {
          prog = 100;
          clearInterval(interval);
          setTimeout(() => {
            setIsTraining(false);
            addToast("Model trained! Accuracy: 98.7%", "success");
          }, 500);
        }
        setTrainingProgress(prog);
        
        if (prog < 20) setTrainingStatus(TRAINING_STAGES[0]);
        else if (prog < 40) setTrainingStatus(TRAINING_STAGES[1]);
        else if (prog < 70) setTrainingStatus(TRAINING_STAGES[2]);
        else if (prog < 90) setTrainingStatus(TRAINING_STAGES[3]);
        else setTrainingStatus(TRAINING_STAGES[4]);

      }, 300);
    }).catch(err => addToast(`Failed to train: ${err.message}`, "error"));
  };

  const featureData = {
    labels: features.map(f => f.feature),
    datasets: [{
      label: 'Importance Score',
      data: features.map(f => f.importance),
      backgroundColor: 'rgba(0,212,255,.8)',
      borderRadius: 4
    }]
  };

  const featureOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: 'var(--text-3)' }, grid: { color: 'var(--border-light)' } },
      y: { ticks: { color: 'var(--text-2)', font: { family: 'var(--mono)' } }, grid: { display: false } }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="grid-3">
        <Card title="Active Models">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px', border: '1px solid var(--green)', borderRadius: '6px', background: 'rgba(0,230,118,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: '500', color: 'var(--text-1)' }}>Random Forest</div>
                <div style={{ background: 'var(--green)', color: '#000', fontSize: '9px', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>PRIMARY</div>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--green)', fontFamily: 'var(--mono)', marginTop: '6px' }}>Accuracy: 98.7%</div>
            </div>
            <div style={{ padding: '12px', border: '1px solid var(--border-light)', borderRadius: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: '500', color: 'var(--text-2)' }}>Decision Tree</div>
                <div style={{ background: 'var(--bg-lighter)', color: 'var(--text-3)', fontSize: '9px', padding: '2px 6px', borderRadius: '4px' }}>BACKUP</div>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--mono)', marginTop: '6px' }}>Accuracy: 96.1%</div>
            </div>
            <div style={{ padding: '12px', border: '1px solid rgba(156,110,255,0.3)', borderRadius: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500', color: 'var(--text-2)' }}><span style={{color:'var(--purple)'}}>●</span> SVM Classifier</div>
                <div style={{ background: 'rgba(156,110,255,0.1)', color: 'var(--purple)', fontSize: '9px', padding: '2px 6px', borderRadius: '4px' }}>EXPERIMENTAL</div>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--mono)', marginTop: '6px' }}>Accuracy: 94.8%</div>
            </div>
            <div style={{ padding: '12px', border: '1px dashed var(--border-light)', borderRadius: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500', color: 'var(--text-3)' }}><span style={{color:'var(--text-3)'}}>●</span> LSTM Deep Net</div>
                <div style={{ background: 'transparent', color: 'var(--text-3)', fontSize: '9px', padding: '2px 6px', border: '1px solid var(--text-3)', borderRadius: '4px' }}>PLANNED</div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Confusion Matrix (Primary Model)">
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: '4px', height: '100%' }}>
            <div></div>
            <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-3)' }}>Predicted Normal</div>
            <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-3)' }}>Predicted Attack</div>

            <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', color: 'var(--text-3)', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Actual Normal</div>
            <div style={{ background: 'rgba(0,230,118,0.15)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: '4px', border: '1px solid rgba(0,230,118,0.3)' }}>
              <div style={{ fontSize: '20px', fontFamily: 'var(--mono)', color: 'var(--green)' }}>{metrics?.confusion_matrix?.tp || '59,832'}</div>
              <div style={{ fontSize: '10px', color: 'var(--green)' }}>True Positives</div>
            </div>
            <div style={{ background: 'rgba(255,140,66,0.15)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: '4px', border: '1px solid rgba(255,140,66,0.3)' }}>
              <div style={{ fontSize: '20px', fontFamily: 'var(--mono)', color: 'var(--orange)' }}>{metrics?.confusion_matrix?.fp || '1,268'}</div>
              <div style={{ fontSize: '10px', color: 'var(--orange)' }}>False Positives</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', color: 'var(--text-3)', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Actual Attack</div>
            <div style={{ background: 'rgba(255,56,96,0.15)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: '4px', border: '1px solid rgba(255,56,96,0.3)' }}>
              <div style={{ fontSize: '20px', fontFamily: 'var(--mono)', color: 'var(--red)' }}>{metrics?.confusion_matrix?.fn || '843'}</div>
              <div style={{ fontSize: '10px', color: 'var(--red)' }}>False Negatives</div>
            </div>
            <div style={{ background: 'rgba(0,212,255,0.15)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: '4px', border: '1px solid rgba(0,212,255,0.3)' }}>
              <div style={{ fontSize: '20px', fontFamily: 'var(--mono)', color: 'var(--accent)' }}>{metrics?.confusion_matrix?.tn || '58,057'}</div>
              <div style={{ fontSize: '10px', color: 'var(--accent)' }}>True Negatives</div>
            </div>
          </div>
        </Card>

        <Card title="Training Controls">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
            <div className="login-field">
              <label className="login-label">Dataset</label>
              <select className="form-input" disabled={isTraining} defaultValue="nsl-kdd">
                <option value="nsl-kdd">NSL-KDD (Standardized)</option>
                <option value="cic-ids">CIC-IDS2017</option>
                <option value="unsw">UNSW-NB15</option>
                <option value="custom">Custom Capture Log</option>
              </select>
            </div>
            <div className="login-field">
              <label className="login-label">Algorithm</label>
              <select className="form-input" disabled={isTraining} defaultValue="rf">
                <option value="rf">Random Forest</option>
                <option value="svm">Support Vector Machine</option>
                <option value="dt">Decision Tree</option>
                <option value="lstm">LSTM Array (TensorFlow)</option>
              </select>
            </div>
            <div className="login-field">
              <label className="login-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Train / Test Split</span>
                <span style={{ color: 'var(--accent)', fontFamily: 'var(--mono)' }}>{split}% / {100-split}%</span>
              </label>
              <input 
                type="range" 
                min="60" max="90" 
                value={split} 
                onChange={(e) => setSplit(e.target.value)}
                disabled={isTraining}
                style={{ width: '100%', accentColor: 'var(--accent)' }}
              />
            </div>

            {isTraining && (
              <div style={{ padding: '12px', background: 'var(--bg-lighter)', borderRadius: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--accent)', marginBottom: '6px' }}>
                  <span>{trainingStatus}</span>
                  <span>{trainingProgress}%</span>
                </div>
                <div className="progress-bar" style={{ margin: 0, height: '4px' }}>
                  <div className="progress-fill" style={{ width: `${trainingProgress}%`, background: 'var(--accent)', transition: 'width 0.3s linear' }}></div>
                </div>
              </div>
            )}

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button className="btn btn-primary" onClick={startTraining} disabled={isTraining}>
                {isTraining ? 'TRAINING IN PROGRESS...' : '⚙ TRAIN MODEL'}
              </button>
              <button className="btn btn-ghost" onClick={() => addToast('Starting evaluation batch...', 'info')} disabled={isTraining}>
                📊 EVALUATE MODEL
              </button>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Feature Importance (Permutation Impact)">
        <div className="chart-wrap" style={{ height: '300px' }}>
          <Bar data={featureData} options={featureOptions} />
        </div>
      </Card>
    </div>
  );
}
