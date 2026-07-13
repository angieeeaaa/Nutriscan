import React, { useState, useEffect } from 'react';

function History({ setScreen, setProduct }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('https://nutriscan-backend-zrv3.onrender.com/api/user/history', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setHistory(data.history || []);
      } catch (err) {
        console.log('Could not load history');
      }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  const handleSelect = (item) => {
    setProduct(item.product_data);
    setScreen('result');
  };

  const verdictColor = (verdict) => {
    if (verdict === 'suitable') return '#1D9E75';
    if (verdict === 'caution') return '#d97706';
    return '#e53e3e';
  };

  const verdictLabel = (verdict) => {
    if (verdict === 'suitable') return '✅ Suitable';
    if (verdict === 'caution') return '⚠️ Caution';
    return '❌ Not recommended';
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <button className="btn-link-back" onClick={() => setScreen('dashboard')}>← Back to dashboard</button>
      </div>
      <div className="card">
        <h2>Scan History</h2>
        <p className="subtitle">Your previously scanned products</p>

        {loading && <p className="loading">Loading history...</p>}

        {!loading && history.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: '#888' }}>
            <p style={{ fontSize: '48px', marginBottom: '1rem' }}>📋</p>
            <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>No scans yet</p>
            <p className="subtitle">Your scan history will appear here</p>
            <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => setScreen('search')}>
              Start scanning
            </button>
          </div>
        )}

        {!loading && history.length > 0 && (
          <div className="results-list">
            {history.map((item, idx) => (
              <div key={idx} className="result-item" onClick={() => handleSelect(item)}>
                <div className="result-info">
                  <p className="result-name">{item.product_name || 'Unknown product'}</p>
                  <p className="result-brand">{item.brand || ''}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: verdictColor(item.verdict) }}>
                      {verdictLabel(item.verdict)}
                    </span>
                    <span style={{ fontSize: 11, color: '#bbb' }}>·</span>
                    <span style={{ fontSize: 11, color: '#bbb' }}>{formatDate(item.scanned_at)}</span>
                  </div>
                </div>
                <span style={{ color: '#ccc', fontSize: 18 }}>›</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default History;