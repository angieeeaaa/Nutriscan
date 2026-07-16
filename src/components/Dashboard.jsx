import React from 'react';

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

function Dashboard({ user, preferences, setScreen }) {
  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <button className="btn-link-back" onClick={() => setScreen('landing')}>← Back to home</button>
      </div>
      <div className="card">
        <h2>Welcome, {user?.name}! 👋</h2>
        <p className="subtitle">Here's your health profile summary</p>

        <button className="btn-primary" onClick={() => setScreen('search')}>
          🔍 Search or Scan a Product
        </button>

        <div className="profile-summary">
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
            <p className="no-prefs">No conditions selected.</p>
          )}
        </div>
 
        <button className="btn-secondary" onClick={() => setScreen('healthprofile')} style={{ marginBottom: '0.5rem' }}>
          👤 My Health Profile
        </button>
        <button className="btn-secondary" onClick={() => setScreen('history')} style={{ marginBottom: '0.5rem' }}>
          📋 View Scan History
        </button>
        <button className="btn-secondary" onClick={() => setScreen('profile')}>
          ✏️ Edit Profile
        </button>
      </div>
    </div>
  );
}

export default Dashboard;