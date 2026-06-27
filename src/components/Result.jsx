import React, { useState, useEffect } from 'react';

function Result({ product, preferences, setScreen }) {
  const [alternatives, setAlternatives] = useState([]);
  const [loadingAlts, setLoadingAlts] = useState(false);

  const nutrients = product?.nutriments || {};
  const ingredients = product?.ingredients_text || 'No ingredient information available.';
  const name = product?.product_name || 'Unknown product';
  const brand = product?.brands || '';
  const image = product?.image_url || null;

  const rules = {
    diabetes: {
      label: 'Diabetes',
      check: () => nutrients['sugars_100g'] > 10 || nutrients['carbohydrates_100g'] > 30,
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
      check: () => /wheat|barley|rye|gluten|flour/i.test(ingredients),
      reason: 'May contain gluten-containing ingredients'
    },
    nuts: {
      label: 'Tree Nuts',
      check: () => /almond|cashew|walnut|pecan|pistachio|hazelnut|macadamia|nut/i.test(ingredients),
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
      check: () => /egg|eggs|albumin/i.test(ingredients),
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
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
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

        <div className="verdict-box" style={{ background: vc.bg, borderColor: vc.color }}>
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
                  <li key={alt.code} className="alt-item">
                    {alt.name}
                  </li>
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
                <p className="nutrition-val">{n.val != null ? `${n.val}${n.unit}` : 'N/A'}</p>
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