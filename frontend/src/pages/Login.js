import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hovered, setHovered] = useState(false); // Define hover state
  const navigate = useNavigate();

  const login = async () => {
    if (!email || !password) return alert('Email and password required.');

    try {
      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.message) navigate('/home');
      else alert(data.error || 'Login failed');
    } catch (err) {
      alert('Login error. Check backend logs.');
      console.error(err);
    }
  };

  const buttonStyle = {
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: hovered ? '#FF1493' : '#FF69B4',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '1em',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  };

  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <h2>Log In</h2>
        <input
          style={inputStyle}
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          style={buttonStyle}
          onClick={login}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          Log In
        </button>
        <p>
          New here?{' '}
          <Link
            to="/register"
            style={{ color: '#FF69B4', textDecoration: 'none' }}
            onMouseEnter={e => (e.target.style.color = '#FF1493')}
            onMouseLeave={e => (e.target.style.color = '#FF69B4')}
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

// Leave the rest of the styles outside
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
  borderRadius: '16px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  textAlign: 'center'
};

const inputStyle = {
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  fontSize: '1em'
};

export default Login;
