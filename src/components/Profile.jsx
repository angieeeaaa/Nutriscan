import React, { useState, useEffect } from 'react';

function Profile({ setScreen, user }) {
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('https://nutriscan-backend-zrv3.onrender.com/api/user/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.preferences) setSelected(data.preferences);
      } catch (err) {
        console.log('Could not load profile');
      }
    };
    loadProfile();
  }, []);

  const toggle = (val) => {
    setSelected(prev =>
      prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
    );
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://nutriscan-backend-zrv3.onrender.com/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ preferences: selected })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      setScreen('dashboard');
    } catch (err) {
      setError('Could not connect to server.');
    }
  };

  const options = [
    { label: 'Diabetes', val: 'diabetes', desc: "We'll flag high sugar & carbs content" },
    { label: 'Hypertension', val: 'hypertension', desc: "We'll flag high sodium content" },
    { label: 'High cholesterol', val: 'high_cholesterol', desc: "We'll flag high saturated fat" },
    { label: 'Kidney disease', val: 'kidney_disease', desc: "We'll flag high potassium & phosphorus" },
    { label: 'Vegetarian', val: 'vegetarian', desc: "We'll flag meat-containing products" },
    { label: 'Vegan', val: 'vegan', desc: "We'll flag all animal products" },
    { label: 'Halal', val: 'halal', desc: "We'll flag non-halal ingredients" },
    { label: 'Gluten-free', val: 'gluten_free', desc: "We'll flag gluten-containing products" },
    { label: 'Tree nuts', val: 'nuts', desc: "We'll flag nut-containing products" },
    { label: 'Shellfish', val: 'shellfish', desc: "We'll flag shellfish ingredients" },
    { label: 'Dairy', val: 'dairy', desc: "We'll flag dairy-containing products" },
    { label: 'Eggs', val: 'eggs', desc: "We'll flag egg-containing products" },
  ];

  return (
    <div className="card">
      <h2>Your health profile</h2>
      <p className="subtitle">Select all that apply</p>
      {error && <p className="error">{error}</p>}
      <div className="chips-grid">
        {options.map(opt => (
          <div
            key={opt.val}
            className={`chip ${selected.includes(opt.val) ? 'selected' : ''}`}
            onClick={() => toggle(opt.val)}
          >
            <span className="chip-label">{opt.label}</span>
            <span className="chip-desc">{opt.desc}</span>
          </div>
        ))}
      </div>
      <button className="btn-primary" onClick={handleSave}>Save and continue</button>
      <button className="btn-secondary" onClick={() => setScreen('login')}>Back</button>
    </div>
  );
}

export default Profile;