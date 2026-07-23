import React, { useState, useEffect } from 'react';
import './App.css';
import Design from './components/Design';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard';
import Search from './components/Search';
import Result from './components/Result';
import History from './components/History';
import HealthProfile from './components/HealthProfile';

function App() {
  const [screen, setScreen] = useState('landing');
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState([]);
  const [product, setProduct] = useState(null);

  useEffect(() => {
  const token = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');
  if (token && savedUser) {
    setUser(JSON.parse(savedUser));
    setScreen('dashboard');
    fetch('https://nutriscan-backend-zrv3.onrender.com/api/user/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { if (data.preferences) setPreferences(data.preferences); });
  }

  const keepAlive = setInterval(() => {
    fetch('https://nutriscan-backend-zrv3.onrender.com/');
  }, 14 * 60 * 1000);
  return () => clearInterval(keepAlive);
}, []);

  const handleSetUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <div className={screen === 'landing' ? '' : 'app-wrap'}>
      {screen === 'landing' && <Design setScreen={setScreen} user={user} preferences={preferences} />}
      {screen === 'login' && <Login setScreen={setScreen} setUser={handleSetUser} />}
      {screen === 'signup' && <Signup setScreen={setScreen} setUser={handleSetUser} />}
      {screen === 'profile' && <Profile setScreen={setScreen} user={user} setPreferences={setPreferences} />}
      {screen === 'dashboard' && <Dashboard user={user} preferences={preferences} setScreen={setScreen} />}
      {screen === 'search' && <Search setScreen={setScreen} setProduct={setProduct} />}
      {screen === 'result' && <Result product={product} preferences={preferences} setScreen={setScreen} />}
      {screen === 'history' && <History setScreen={setScreen} setProduct={setProduct} />}
      {screen === 'healthprofile' && <HealthProfile setScreen={setScreen} preferences={preferences} setProduct={setProduct} />}
    </div>
  );
}

export default App;