import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const login = async () => {
    if (!email || !password) return alert('Email and password required.');

    const res = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (data.message) navigate('/home');
    else alert(data.error || 'Login failed');
  };

  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <h2>Log In</h2>
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button onClick={login}>Log In</button>
        <p>New here? <Link to="/register">Create an account</Link></p>
      </div>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#fff'
};

const formStyle = {
  width: '320px',
  padding: '30px',
  background: '#f9f9f9',
  borderRadius: '10px',
  boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  textAlign: 'center'
};

export default Login;
