import React, { useState } from 'react';
import Scanner from './Scanner';

function Search({ setScreen, setProduct }) {
  const [tab, setTab] = useState('search');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResults([]);
    try {
      const res = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=10`
      );
      const data = await res.json();
      if (data.products && data.products.length > 0) {
        setResults(data.products);
      } else {
        setError('No products found. Try a different search term.');
      }
    } catch (err) {
      setError('Could not fetch products. Check your connection.');
    }
    setLoading(false);
  };

  const handleBarcodeScan = async (barcode) => {
    setScanning(false);
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
      const data = await res.json();
      if (data.status === 1 && data.product) {
        setProduct(data.product);
        setScreen('result');
      } else {
        setError('Product not found in database. Try searching by name.');
        setTab('search');
      }
    } catch (err) {
      setError('Could not fetch product. Check your connection.');
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
          <button className={`tab-btn ${tab === 'search' ? 'active' : ''}`} onClick={() => { setTab('search'); setScanning(false); }}>🔍 Search</button>
          <button className={`tab-btn ${tab === 'scan' ? 'active' : ''}`} onClick={() => setTab('scan')}>📷 Scan</button>
        </div>

        {tab === 'search' && (
          <div>
            <div className="search-row">
              <input
                type="text"
                placeholder="e.g. Milo, Pocky, Kit Kat..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                className="search-input"
              />
              <button className="search-btn" onClick={handleSearch}>Go</button>
            </div>
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
                    <input type="text" placeholder="e.g. 5449000000996" className="search-input" onKeyDown={e => e.key === 'Enter' && handleBarcodeScan(e.target.value)} />
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