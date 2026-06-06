import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard';

function App() {
  const [screen, setScreen] = useState('login');
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState([]);

  return (
    <div className="app-wrap">
      {screen === 'login' && (
        <Login setScreen={setScreen} setUser={setUser} />
      )}
      {screen === 'signup' && (
        <Signup setScreen={setScreen} setUser={setUser} />
      )}
      {screen === 'profile' && (
        <Profile
          setScreen={setScreen}
          user={user}
          preferences={preferences}
          setPreferences={setPreferences}
        />
      )}
      {screen === 'dashboard' && (
        <Dashboard
          user={user}
          preferences={preferences}
          setScreen={setScreen}
        />
      )}
    </div>
  );
}

export default App;