import React, { useState } from 'react';

function Signup({ setScreen, setUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    try {
      const res = await fetch('https://nutriscan-backend-zrv3.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      localStorage.setItem('token', data.token);
      setUser(data);
      setScreen('profile');
    } catch (err) {
      setError('Could not connect to server.');
    }
  };

  return (
    <div className="card">
      <h2>Create account</h2>
      <p className="subtitle">Start scanning smarter</p>
      {error && <p className="error">{error}</p>}
      <div className="field">
        <label>Full name</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Tan" />
      </div>
      <div className="field">
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
      </div>
      <div className="field">
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" />
      </div>
      <button className="btn-primary" onClick={handleSignup}>Continue</button>
      <p className="switch">Have an account? <span className="link" onClick={() => setScreen('login')}>Log in</span></p>
    </div>
  );
}

export default Signup;