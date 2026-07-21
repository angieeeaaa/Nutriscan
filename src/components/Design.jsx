import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import heroBg from '../hero-bg.png';

function Design({ setScreen, user, preferences }) {
  const handleFeatureClick = (target) => {
    if (user) {
      setScreen(target);
    } else {
      setScreen('login');
    }
  };

  return (
    <div style={{ width: '100vw', overflowX: 'hidden' }}>

      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2.5rem', background: '#fff', borderBottom: '1px solid #e8f5f0' }}>
        <span style={{ fontSize: 20, fontWeight: 800, color: '#0F6E56' }}>🥦 NutriLens</span>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline-success btn-sm" onClick={() => setScreen('login')}>Log in</button>
          <button className="btn btn-success btn-sm" onClick={() => setScreen('signup')}>Get started</button>
        </div>
      </nav>

      <div style={{ background: `linear-gradient(rgba(10,60,40,0.72), rgba(10,60,40,0.72)), url(${heroBg}) center/cover no-repeat`, minHeight: 460, display: 'flex', alignItems: 'center', padding: '4rem 2.5rem' }}>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 20, padding: '5px 14px', fontSize: 12, fontWeight: 600, color: '#9FE1CB', marginBottom: '1.25rem' }}>🌿 Smart Nutrition Guidance</span>
            <h1 style={{ fontSize: 38, fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: '1rem' }}>Eat smarter,<br />live <span style={{ color: '#9FE1CB' }}>healthier</span></h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.82)', maxWidth: 400, marginBottom: '2rem', lineHeight: 1.6 }}>Scan any food product barcode and instantly know if it's right for your health conditions and dietary needs.</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button style={{ padding: '12px 24px', background: '#fff', color: '#0F6E56', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }} onClick={() => setScreen('signup')}>Start scanning free</button>
              <button style={{ padding: '12px 24px', background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.5)', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }} onClick={() => setScreen('login')}>Log in</button>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 220, display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: '1.25rem', width: 240, boxShadow: '0 20px 50px rgba(0,0,0,0.25)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0F6E56', marginBottom: 4 }}>👋 Your Health Dashboard</div>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 12 }}>Your selected conditions</div>
              {user && preferences && preferences.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
                  {preferences.slice(0, 4).map(p => (
                    <span key={p} style={{ background: '#E1F5EE', color: '#0F6E56', borderRadius: 6, padding: '4px 8px', fontSize: 10, fontWeight: 600 }}>{p}</span>
                  ))}
                </div>
              ) : (
                <div style={{ background: '#f8fdfb', borderRadius: 8, padding: 10, textAlign: 'center', fontSize: 11, color: '#aaa', marginBottom: 12 }}>
                  {user ? 'No conditions selected yet' : 'Log in to view your dashboard'}
                </div>
              )}
              <button style={{ width: '100%', padding: 8, background: '#1D9E75', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }} onClick={() => user ? setScreen('dashboard') : setScreen('login')}>
                {user ? 'View full dashboard →' : 'Log in to get started →'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', background: '#085041' }}>
        {[
          { num: '2M+', title: 'Products', sub: 'in our database' },
          { num: '12', title: 'Health Conditions', sub: 'supported & analysed' },
          { num: '100%', title: 'Free to Use', sub: 'no subscription needed' },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', padding: '1.25rem', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#9FE1CB' }}>{s.num}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginTop: 2 }}>{s.title}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: '4rem 2.5rem', background: '#f8fdfb' }}>
        <h2 style={{ textAlign: 'center', fontSize: 26, fontWeight: 800, color: '#1a1a1a', marginBottom: 6 }}>Explore our features just for you</h2>
        <p style={{ textAlign: 'center', color: '#888', fontSize: 14, marginBottom: '2rem' }}>Click on a feature to get started — login required</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
          {[
            { icon: '📷', title: 'Barcode scanning', desc: 'Point your camera at any packaged food barcode for instant product lookup.', target: 'search', active: true },
            { icon: '📋', title: 'Scan History', desc: 'View all your previously scanned products and their suitability verdicts.', target: 'history', active: true },
            { icon: '🔍', title: 'Product search', desc: "Search millions of products by name when scanning isn't available.", target: 'search', active: true },
            { icon: '👤', title: 'My Health Profile', desc: 'View your health conditions and manage your saved favourite products.', target: 'healthprofile', active: true },
          ].map((f, i) => (
            <div key={i}
              onClick={() => f.active && handleFeatureClick(f.target)}
              style={{ background: '#1D9E75', borderRadius: 16, padding: '1.5rem 1.25rem', color: '#fff', cursor: f.active ? 'pointer' : 'default', opacity: f.active ? 1 : 0.55, position: 'relative', transition: 'transform 0.15s' }}
              onMouseEnter={e => { if (f.active) e.currentTarget.style.background = '#0F6E56'; }}
              onMouseLeave={e => { if (f.active) e.currentTarget.style.background = '#1D9E75'; }}
            >
              {!f.active && <span style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(255,255,255,0.2)', borderRadius: 4, padding: '2px 6px', fontSize: 9, fontWeight: 600 }}>Coming soon</span>}
              <div style={{ fontSize: 28, marginBottom: '0.75rem' }}>{f.icon}</div>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, color: '#fff' }}>{f.title}</h3>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '4rem 2.5rem', background: '#fff' }}>
        <h2 style={{ textAlign: 'center', fontSize: 26, fontWeight: 800, color: '#1a1a1a', marginBottom: 6 }}>How it works</h2>
        <p style={{ textAlign: 'center', color: '#888', fontSize: 14, marginBottom: '3rem' }}>Three simple steps to smarter eating</p>
        <div style={{ display: 'flex', gap: '2rem', maxWidth: 700, margin: '0 auto' }}>
          {[
            { num: 1, title: 'Set up your profile', desc: 'Select your health conditions, dietary preferences and allergies' },
            { num: 2, title: 'Scan or search', desc: 'Scan a barcode or search for any packaged food product' },
            { num: 3, title: 'Get your verdict', desc: 'See if the product is suitable with clear explanations why' },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#1D9E75', color: '#fff', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>{s.num}</div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>{s.title}</h3>
              <p style={{ fontSize: 11, color: '#888', lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '1.25rem 2.5rem', textAlign: 'center', fontSize: 12, color: '#aaa', borderTop: '1px solid #e8f5f0' }}>
        © 2026 FoodLens · Built for NUS Orbital
      </div>
    </div>
  );
}

export default Design;