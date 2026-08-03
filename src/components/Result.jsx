import React, { useState, useEffect } from 'react';

function TrafficLight({ verdict }) {
  const lights = [
    { id: 'suitable', color: '#1D9E75', dimColor: '#d1f0e6', label: 'Suitable' },
    { id: 'caution', color: '#d97706', dimColor: '#fde8b0', label: 'Caution' },
    { id: 'unsuitable', color: '#e53e3e', dimColor: '#fecaca', label: 'Not\nRecommended' },
  ];

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-evenly',
      alignItems: 'flex-start',
      padding: '12px 0',
      marginBottom: '8px',
    }}>
      {lights.map(light => (
        <div key={light.id} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          width: '33%',
        }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            backgroundColor: verdict === light.id ? light.color : light.dimColor,
            boxShadow: verdict === light.id ? `0 0 12px ${light.color}` : 'none',
            transition: 'all 0.3s ease',
          }} />
          <span style={{
            fontSize: 10,
            fontWeight: verdict === light.id ? 700 : 400,
            color: verdict === light.id ? light.color : '#aaa',
            textAlign: 'center',
            whiteSpace: 'pre-line',
            lineHeight: 1.3,
          }}>
            {light.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function Result({ product, preferences, setScreen }) {
  const [alternatives, setAlternatives] = useState([]);
  const [loadingAlts, setLoadingAlts] = useState(false);
  const [isFavourited, setIsFavourited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const nutrients = product?.nutriments || {};
  const ingredients = product?.ingredients_text || 'No ingredient information available.';
  const name = product?.product_name || 'Unknown product';
  const brand = product?.brands || '';
  const image = product?.image_url || null;

  const rules = {
    diabetes: {
      label: 'Diabetes',
      check: () => nutrients['sugars_100g'] > 5 || nutrients['carbohydrates_100g'] > 30,
      reason: `High sugar (${nutrients['sugars_100g'] || 0}g) or carbs (${nutrients['carbohydrates_100g'] || 0}g) per 100g`
    },
    hypertension: { 
      label: 'Hypertension',
      check: () => nutrients['sodium_100g'] > 0.6 || nutrients['salt_100g'] > 1.5,
      reason: `High sodium (${nutrients['sodium_100g'] || 0}g) per 100g`
    },
    high_cholesterol: {
      label: 'High Cholesterol',
      check: () => nutrients['saturated-fat_100g'] > 5,
      reason: `High saturated fat (${nutrients['saturated-fat_100g'] || 0}g) per 100g`
    },
    kidney_disease: {
      label: 'Kidney Disease',
      check: () => nutrients['potassium_100g'] > 200 || nutrients['phosphorus_100g'] > 100,
      reason: 'High potassium or phosphorus content'
    },
    vegetarian: {
      label: 'Vegetarian',
      check: () => /beef|pork|chicken|meat|fish|seafood|gelatin/i.test(ingredients),
      reason: 'May contain meat-based ingredients'
    },
    vegan: {
      label: 'Vegan',
      check: () => /milk|egg|honey|beef|pork|chicken|meat|fish|seafood|gelatin|dairy|whey|casein/i.test(ingredients),
      reason: 'May contain animal-derived ingredients'
    },
    halal: {
      label: 'Halal',
      check: () => /pork|lard|gelatin|alcohol|wine|beer/i.test(ingredients),
      reason: 'May contain non-halal ingredients'
    },
    gluten_free: {
      label: 'Gluten-free',
      check: () => /wheat|barley|rye|gluten|(wheat|barley|rye)\s+flour/i.test(ingredients),
      reason: 'May contain gluten-containing ingredients'
    }, 
    nuts: {
      label: 'Tree Nuts',
      check: () => /\b(almond|cashew|walnut|pecan|pistachio|hazelnut|macadamia|brazil nut|tree nut)s?\b/i.test(ingredients),
      reason: 'May contain tree nuts'
    },
    shellfish: {
      label: 'Shellfish',
      check: () => /shrimp|prawn|crab|lobster|shellfish|crustacean/i.test(ingredients),
      reason: 'May contain shellfish'
    },
    dairy: {
      label: 'Dairy',
      check: () => /milk|cheese|butter|cream|yogurt|whey|casein|lactose/i.test(ingredients),
      reason: 'May contain dairy ingredients'
    },
    eggs: {
      label: 'Eggs',
      check: () => /\b(egg|eggs|albumin)\b/i.test(ingredients),
      reason: 'May contain eggs'
    },
  };

  const flags = (preferences || []).filter(pref => rules[pref] && rules[pref].check());
  const verdict = flags.length === 0 ? 'suitable' : flags.length <= 2 ? 'caution' : 'unsuitable';

  const verdictConfig = {
    suitable: { label: '✅ Suitable for you', color: '#1D9E75', bg: '#e6f7f1' },
    caution: { label: '⚠️ Use with caution', color: '#d97706', bg: '#fffbeb' },
    unsuitable: { label: '❌ Not recommended', color: '#e53e3e', bg: '#fff5f5' },
  };

  const vc = verdictConfig[verdict];

  useEffect(() => {
    const checkFavourite = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('https://nutriscan-backend-zrv3.onrender.com/api/user/favourites', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        const already = (data.favourites || []).some(f => f.product_name === name);
        setIsFavourited(already);
      } catch (err) {
        console.log('Could not check favourites');
      }
    };
    if (product) checkFavourite();
  }, [product, name]);

  const toggleFavourite = async () => {
    setFavLoading(true);
    const token = localStorage.getItem('token');
    try {
      if (isFavourited) {
        await fetch(`https://nutriscan-backend-zrv3.onrender.com/api/user/favourites/${encodeURIComponent(name)}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setIsFavourited(false);
      } else {
        await fetch('https://nutriscan-backend-zrv3.onrender.com/api/user/favourites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ product_name: name, brand, verdict, product_data: product })
        });
        setIsFavourited(true);
      }
    } catch (err) {
      console.log('Could not update favourites');
    }
    setFavLoading(false);
  };

  useEffect(() => {
    if (!product || verdict === 'suitable') {
      setAlternatives([]);
      return;
    }
    const fetchAlternatives = async () => {
      setLoadingAlts(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('https://nutriscan-backend-zrv3.onrender.com/api/alternatives', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ product })
        });
        const data = await res.json();
        setAlternatives(data.alternatives || []);
      } catch (err) {
        console.log('Could not load alternatives');
        setAlternatives([]);
      } finally {
        setLoadingAlts(false);
      }
    };
    fetchAlternatives();
  }, [product, verdict]);

  useEffect(() => {
    if (!product) return;
    const saveHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        await fetch('https://nutriscan-backend-zrv3.onrender.com/api/user/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ product_name: name, brand, verdict, product_data: product })
        });
      } catch (err) {
        console.log('Could not save to history');
      }
    };
    saveHistory();
  }, [product, name, brand, verdict]);

  if (!product) return null;

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <button className="btn-link-back" onClick={() => setScreen('search')}>← Back to search</button>
      </div>
      <div className="card">
        {image && <img src={image} alt={name} className="product-img" />}
        <h2>{name}</h2>
        {brand && <p className="result-brand" style={{ marginBottom: '1rem' }}>{brand}</p>}

        <button
          onClick={toggleFavourite}
          disabled={favLoading}
          style={{
            background: isFavourited ? '#E1F5EE' : '#f8f8f8',
            border: `1.5px solid ${isFavourited ? '#1D9E75' : '#e0e0e0'}`,
            borderRadius: 10,
            padding: '8px 16px',
            fontSize: 13,
            fontWeight: 600,
            color: isFavourited ? '#0F6E56' : '#888',
            cursor: 'pointer',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          {isFavourited ? '❤️ Saved to favourites' : '🤍 Save to favourites'}
        </button>

        <div className="verdict-box" style={{ background: vc.bg, borderColor: vc.color }}>
          <TrafficLight verdict={verdict} />
          <p className="verdict-label" style={{ color: vc.color }}>{vc.label}</p>
          {flags.length > 0 && (
            <ul className="flag-list">
              {flags.map(f => (
                <li key={f} style={{ color: vc.color }}>
                  <strong>{rules[f].label}:</strong> {rules[f].reason}
                </li>
              ))}
            </ul>
          )}
        </div>

        {verdict !== 'suitable' && (
          <div className="alternatives-section">
            <p className="section-label">Better alternatives</p>
            {loadingAlts && <p className="alt-loading">Looking for alternatives...</p>}
            {!loadingAlts && alternatives.length === 0 && (
              <p className="alt-empty">No suitable alternatives found in this category.</p>
            )}
            {!loadingAlts && alternatives.length > 0 && (
              <ul className="alt-list">
                {alternatives.map(alt => (
                  <li key={alt.code} className="alt-item">{alt.name}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="nutrition-section">
          <p className="section-label">Nutrition per 100g</p>
          <div className="nutrition-grid">
            {[
              { label: 'Calories', val: nutrients['energy-kcal_100g'], unit: 'kcal' },
              { label: 'Carbs', val: nutrients['carbohydrates_100g'], unit: 'g' },
              { label: 'Sugar', val: nutrients['sugars_100g'], unit: 'g' },
              { label: 'Fat', val: nutrients['fat_100g'], unit: 'g' },
              { label: 'Saturated Fat', val: nutrients['saturated-fat_100g'], unit: 'g' },
              { label: 'Protein', val: nutrients['proteins_100g'], unit: 'g' },
              { label: 'Salt', val: nutrients['salt_100g'], unit: 'g' },
              { label: 'Sodium', val: nutrients['sodium_100g'], unit: 'g' },
            ].map(n => (
              <div key={n.label} className="nutrition-item">
                <p className="nutrition-val">{n.val != null ? `${parseFloat(n.val).toFixed(1)}${n.unit}` : 'N/A'}</p>
                <p className="nutrition-label">{n.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="ingredients-section">
          <p className="section-label">Ingredients</p>
          <p className="ingredients-text">{ingredients}</p>
        </div>
      </div>
    </div>
  );
}

export default Result;