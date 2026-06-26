import React, { useState } from 'react';

function Login({ setScreen, setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }
    try {
      const res = await fetch('https://nutriscan-backend-zrv3.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      localStorage.setItem('token', data.token);
      setUser(data);
      setScreen('dashboard');
    } catch (err) {
      setError('Could not connect to server.');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <button className="btn-link-back" onClick={() => setScreen('landing')}>← Back to home</button>
      </div>
      <div className="card">
        <h2>Welcome back</h2>
        <p className="subtitle">Log in to continue scanning</p>
        {error && <p className="error">{error}</p>}
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <button className="btn-primary" onClick={handleLogin}>Log in</button>
        <p className="switch">No account? <span className="link" onClick={() => setScreen('signup')}>Sign up</span></p>
      </div>
    </div>
  );
}

export default Login;