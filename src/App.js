import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';

function App() {
  const [screen, setScreen] = useState('login');
  const [user, setUser] = useState(null);

  return (
    <div className="app-wrap">
      {screen === 'login' && <Login setScreen={setScreen} setUser={setUser} />}
      {screen === 'signup' && <Signup setScreen={setScreen} setUser={setUser} />}
      {screen === 'profile' && <Profile setScreen={setScreen} user={user} />}
      {screen === 'dashboard' && (
        <div className="card">
          <h2>Welcome{user ? `, ${user.name}` : ''}! 👋</h2>
          <p className="subtitle">Your profile is all set. Dashboard coming soon!</p>
        </div>
      )}
    </div>
  );
}

export default App;