import React, { useState, useEffect } from 'react';

const conditionLabels = {
  diabetes: 'Diabetes',
  hypertension: 'Hypertension',
  high_cholesterol: 'High Cholesterol',
  kidney_disease: 'Kidney Disease',
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  halal: 'Halal',
  gluten_free: 'Gluten-free',
  nuts: 'Tree Nuts',
  shellfish: 'Shellfish',
  dairy: 'Dairy',
  eggs: 'Eggs',
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

function HealthProfile({ setScreen, preferences, setProduct }) {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('https://nutriscan-backend-zrv3.onrender.com/api/user/favourites', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setFavourites(data.favourites || []);
      } catch (err) {
        console.log('Could not load favourites');
      }
      setLoading(false);
    };
    fetchFavourites();
  }, []);

  const handleRemove = async (productName) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`https://nutriscan-backend-zrv3.onrender.com/api/user/favourites/${encodeURIComponent(productName)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setFavourites(prev => prev.filter(f => f.product_name !== productName));
    } catch (err) {
      console.log('Could not remove favourite');
    }
  };

  const handleSelect = (item) => {
    setProduct(item.product_data);
    setScreen('result');
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <button className="btn-link-back" onClick={() => setScreen('dashboard')}>← Back to dashboard</button>
      </div>
      <div className="card">
        <h2>My Health Profile</h2>
        <p className="subtitle">Your conditions, preferences and saved products</p>

        <div style={{ marginBottom: '1.5rem' }}>
          <p className="section-label">Your selected conditions & preferences</p>
          {preferences && preferences.length > 0 ? (
            <div className="chips-grid">
              {preferences.map(pref => (
                <div key={pref} className="chip selected">
                  <span className="chip-label">{conditionLabels[pref] || pref}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#888', fontSize: 13 }}>No conditions selected. <span className="link" onClick={() => setScreen('profile')}>Set up your profile →</span></p>
          )}
          <button className="btn-secondary" onClick={() => setScreen('profile')} style={{ marginTop: '0.75rem' }}>
            ✏️ Edit Profile
          </button>
        </div>

        <div>
          <p className="section-label">Saved products ❤️</p>
          {loading && <p className="loading">Loading saved products...</p>}
          {!loading && favourites.length === 0 && (
            <div style={{ textAlign: 'center', padding: '1.5rem 0', color: '#888' }}>
              <p style={{ fontSize: '36px', marginBottom: '0.5rem' }}>🤍</p>
              <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>No saved products yet</p>
              <p className="subtitle">Tap the heart icon on any product to save it</p>
              <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => setScreen('search')}>
                Start scanning
              </button>
            </div>
          )}
          {!loading && favourites.length > 0 && (
            <div className="results-list">
              {favourites.map((item, idx) => (
                <div key={idx} className="result-item">
                  <div className="result-info" onClick={() => handleSelect(item)} style={{ cursor: 'pointer', flex: 1 }}>
                    <p className="result-name">{item.product_name || 'Unknown product'}</p>
                    <p className="result-brand">{item.brand || ''}</p>
                    <span style={{ fontSize: 11, fontWeight: 600, color: verdictColor(item.verdict) }}>
                      {verdictLabel(item.verdict)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemove(item.product_name)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#e53e3e', padding: '0 8px' }}
                  >
                    ❤️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HealthProfile;