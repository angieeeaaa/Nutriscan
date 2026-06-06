import React, { useState } from 'react';

function Profile({ setScreen, user }) {
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState('');

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
    { label: 'Diabetes', val: 'diabetes' },
    { label: 'Hypertension', val: 'hypertension' },
    { label: 'High cholesterol', val: 'high_cholesterol' },
    { label: 'Kidney disease', val: 'kidney_disease' },
    { label: 'Vegetarian', val: 'vegetarian' },
    { label: 'Vegan', val: 'vegan' },
    { label: 'Halal', val: 'halal' },
    { label: 'Gluten-free', val: 'gluten_free' },
    { label: 'Tree nuts', val: 'nuts' },
    { label: 'Shellfish', val: 'shellfish' },
    { label: 'Dairy', val: 'dairy' },
    { label: 'Eggs', val: 'eggs' },
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
            {opt.label}
          </div>
        ))}
      </div>
      <button className="btn-primary" onClick={handleSave}>Save and continue</button>
      <button className="btn-secondary" onClick={() => setScreen('signup')}>Back</button>
    </div>
  );
}

export default Profile;