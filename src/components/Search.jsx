import React, { useState } from 'react';
import Scanner from './Scanner';

const FALLBACK_PRODUCTS = [
  {
    barcode: '8888020007773',
    product_name: 'Milo',
    brands: 'Nestlé',
    image_small_url: '',
    nutriments: { 'energy-kcal_100g': 366, 'sugars_100g': 46, 'fat_100g': 3.5, 'saturated-fat_100g': 1.8, 'proteins_100g': 8.6, 'salt_100g': 0.4, 'sodium_100g': 0.16, 'carbohydrates_100g': 73 },
    ingredients_text: 'Malt extract, sugar, skimmed milk powder, cocoa powder, vitamins and minerals'
  },
  {
    barcode: '4902525025204',
    product_name: 'Yakult',
    brands: 'Yakult',
    image_small_url: '',
    nutriments: { 'energy-kcal_100g': 71, 'sugars_100g': 14.1, 'fat_100g': 0, 'saturated-fat_100g': 0, 'proteins_100g': 1.2, 'salt_100g': 0.05, 'sodium_100g': 0.02, 'carbohydrates_100g': 16 },
    ingredients_text: 'Water, sugar, skimmed milk powder, glucose, live Lactobacillus casei Shirota cultures'
  },
  {
    barcode: '5000112637939',
    product_name: 'Maggi Instant Noodles Chicken',
    brands: 'Maggi',
    image_small_url: '',
    nutriments: { 'energy-kcal_100g': 436, 'sugars_100g': 2.1, 'fat_100g': 16.8, 'saturated-fat_100g': 7.8, 'proteins_100g': 9.3, 'salt_100g': 4.1, 'sodium_100g': 1.6, 'carbohydrates_100g': 62 },
    ingredients_text: 'Wheat flour, palm oil, salt, sugar, monosodium glutamate, chicken flavour, soy sauce powder'
  },
  {
    barcode: '4901005502008',
    product_name: 'Pocky Chocolate',
    brands: 'Glico',
    image_small_url: '',
    nutriments: { 'energy-kcal_100g': 476, 'sugars_100g': 38, 'fat_100g': 19, 'saturated-fat_100g': 9, 'proteins_100g': 7.4, 'salt_100g': 0.6, 'sodium_100g': 0.24, 'carbohydrates_100g': 65 },
    ingredients_text: 'Wheat flour, sugar, vegetable fat, cocoa powder, milk powder, eggs, salt, lecithin'
  },
  {
    barcode: '5000171036038',
    product_name: 'Ribena Blackcurrant',
    brands: 'Ribena',
    image_small_url: '',
    nutriments: { 'energy-kcal_100g': 43, 'sugars_100g': 10, 'fat_100g': 0, 'saturated-fat_100g': 0, 'proteins_100g': 0.1, 'salt_100g': 0.02, 'sodium_100g': 0.008, 'carbohydrates_100g': 10.5 },
    ingredients_text: 'Water, blackcurrant juice, sugar, citric acid, vitamin C, natural flavouring'
  },
  {
    barcode: '7613035980693',
    product_name: 'Kit Kat Original',
    brands: 'Nestlé',
    image_small_url: '',
    nutriments: { 'energy-kcal_100g': 515, 'sugars_100g': 51, 'fat_100g': 27, 'saturated-fat_100g': 16, 'proteins_100g': 6.3, 'salt_100g': 0.2, 'sodium_100g': 0.08, 'carbohydrates_100g': 63 },
    ingredients_text: 'Sugar, wheat flour, cocoa butter, skimmed milk powder, cocoa mass, palm oil, whey powder, lactose, milk fat, lecithin, vanillin'
  },
  {
    barcode: '8888000762001',
    product_name: '100 Plus Original',
    brands: 'F&N',
    image_small_url: '',
    nutriments: { 'energy-kcal_100g': 26, 'sugars_100g': 6.3, 'fat_100g': 0, 'saturated-fat_100g': 0, 'proteins_100g': 0, 'salt_100g': 0.1, 'sodium_100g': 0.04, 'carbohydrates_100g': 6.5 },
    ingredients_text: 'Carbonated water, sugar, citric acid, sodium citrate, potassium chloride, sodium chloride, magnesium sulphate'
  },
  {
    barcode: '4902777022819',
    product_name: 'Meiji Milk Chocolate',
    brands: 'Meiji',
    image_small_url: '',
    nutriments: { 'energy-kcal_100g': 556, 'sugars_100g': 52, 'fat_100g': 33, 'saturated-fat_100g': 19, 'proteins_100g': 7, 'salt_100g': 0.2, 'sodium_100g': 0.08, 'carbohydrates_100g': 57 },
    ingredients_text: 'Sugar, whole milk powder, cocoa butter, cocoa mass, lactose, whey powder, lecithin, vanillin'
  },
];

const normalise = str => str.toLowerCase().replace(/[\s\-_.]/g, '');

function Search({ setScreen, setProduct }) {
  const [tab, setTab] = useState('search');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);

  const searchFallback = (q) => {
    const norm = normalise(q);
    return FALLBACK_PRODUCTS.filter(p =>
      normalise(p.product_name).includes(norm) ||
      normalise(p.brands).includes(norm) ||
      norm.includes(normalise(p.product_name)) ||
      norm.includes(normalise(p.brands))
    );
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(
        `https://nutriscan-backend-zrv3.onrender.com/api/food/search?query=${encodeURIComponent(query)}`,
        { signal: controller.signal }
      );
      clearTimeout(timeout);

      if (!res.ok) throw new Error('Server error');

      const data = await res.json();

      if (data.products && data.products.length > 0) {
        setResults(data.products);
      } else {
        const fallback = searchFallback(query);
        if (fallback.length > 0) {
          setResults(fallback);
          setError('No online results found. Showing similar offline products.');
        } else {
          setError('No products found. Try a different search term.');
        }
      }
    } catch (err) {
      const fallback = searchFallback(query);
      if (fallback.length > 0) {
        setResults(fallback);
        setError('⚠️ Server unavailable. Showing offline results.');
      } else {
        setError('Could not connect. Try: Milo, Yakult, Maggi, Pocky, Ribena, Kit Kat, 100 Plus, Meiji');
      }
    }

    setLoading(false);
  };

  const handleBarcodeScan = async (barcode) => {
    setScanning(false);
    setLoading(true);
    setError('');

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(
        `https://nutriscan-backend-zrv3.onrender.com/api/food/barcode/${barcode}`,
        { signal: controller.signal }
      );
      clearTimeout(timeout);

      if (!res.ok) throw new Error('Server error');

      const data = await res.json();
      if (data.status === 1 && data.product) {
        setProduct(data.product);
        setScreen('result');
      } else {
        throw new Error('Not found');
      }
    } catch (err) {
      const match = FALLBACK_PRODUCTS.find(p => p.barcode === barcode);
      if (match) {
        setProduct(match);
        setScreen('result');
      } else {
        setError('Product not found. Try searching by name instead.');
        setTab('search');
      }
    }

    setLoading(false);
  };

  const handleSelect = (product) => {
    setProduct(product);
    setScreen('result');
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <button className="btn-link-back" onClick={() => setScreen('dashboard')}>← Back to dashboard</button>
      </div>
      <div className="card">
        <h2>Find a product</h2>
        <p className="subtitle">Search by name or scan a barcode</p>

        <div className="tab-row">
          <button
            className={`tab-btn ${tab === 'search' ? 'active' : ''}`}
            onClick={() => { setTab('search'); setScanning(false); setError(''); setResults([]); }}
          >🔍 Search</button>
          <button
            className={`tab-btn ${tab === 'scan' ? 'active' : ''}`}
            onClick={() => { setTab('scan'); setError(''); setResults([]); }}
          >📷 Scan</button>
        </div>

        {tab === 'search' && (
          <div>
            <div className="search-row">
              <input
                type="text"
                placeholder="e.g. Milo, Yakult, Kit Kat..."
                value={query}
                onChange={e => { setQuery(e.target.value); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                className="search-input"
              />
              <button className="search-btn" onClick={handleSearch}>Go</button>
            </div>
            <p style={{ fontSize: 11, color: '#aaa', marginTop: 4, marginBottom: 8 }}>
              Tip: use spaces for best results (e.g. "kit kat" not "kitkat")
            </p>
            {loading && <p className="loading">Searching...</p>}
            {error && <p className="error">{error}</p>}
            <div className="results-list">
              {results.map((product, idx) => (
                <div key={idx} className="result-item" onClick={() => handleSelect(product)}>
                  {product.image_small_url && (
                    <img src={product.image_small_url} alt={product.product_name} className="result-img" />
                  )}
                  <div className="result-info">
                    <p className="result-name">{product.product_name || 'Unknown product'}</p>
                    <p className="result-brand">{product.brands || ''}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'scan' && (
          <div>
            {!scanning ? (
              <div className="scan-placeholder">
                <p style={{ fontSize: '48px', marginBottom: '1rem' }}>📷</p>
                <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Scan a barcode</p>
                <p className="subtitle">Point your camera at any food product barcode</p>
                <button className="btn-primary" onClick={() => setScanning(true)}>Start Camera</button>
                <div style={{ marginTop: '1rem' }}>
                  <p className="subtitle">Or enter barcode manually:</p>
                  <div className="search-row">
                    <input
                      type="text"
                      placeholder="e.g. 8888020007773"
                      className="search-input"
                      onKeyDown={e => e.key === 'Enter' && handleBarcodeScan(e.target.value)}
                    />
                    <button className="search-btn" onClick={e => handleBarcodeScan(e.target.previousSibling.value)}>Go</button>
                  </div>
                </div>
                {error && <p className="error" style={{ marginTop: '1rem' }}>{error}</p>}
              </div>
            ) : (
              <Scanner onScan={handleBarcodeScan} onClose={() => setScanning(false)} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;