import { useState, CSSProperties } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

interface FormData {
  name: string;
  email: string;
  password: string;
}

function Register(): JSX.Element {
  const [form, setForm] = useState<FormData>({ name: '', email: '', password: '' });
  const [hovered, setHovered] = useState<boolean>(false);
  const [linkHovered, setLinkHovered] = useState<boolean>(false);
  const navigate = useNavigate();

  const register = async (): Promise<void> => {
    const { name, email, password } = form;
    if (!name || !email || !password) {
      alert('All fields required.');
      return;
    }

    const res = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (data.message) {
      navigate('/home');
    } else {
      alert(data.error || 'Registration failed');
    }
  };

  const buttonStyle: CSSProperties = {
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: hovered ? '#FF1493' : '#FF69B4',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '1em',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const linkStyle: CSSProperties = {
    color: linkHovered ? '#FF1493' : '#FF69B4',
    textDecoration: 'none',
    fontWeight: 'normal',
  };

  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <h2>Create Account</h2>
        <input
          className="styled-input"
          placeholder="Full Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="styled-input"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="styled-input"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <button
          style={buttonStyle}
          onClick={register}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          Sign Up
        </button>
        <p style={{ fontWeight: 'normal' }}>
          Already have an account?{' '}
          <Link
            to="/login"
            style={linkStyle}
            onMouseEnter={() => setLinkHovered(true)}
            onMouseLeave={() => setLinkHovered(false)}
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

// Styling
const containerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#fff',
};

const formStyle: CSSProperties = {
  width: '320px',
  padding: '30px',
  background: '#f9f9f9',
  borderRadius: '16px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  textAlign: 'center',
};

export default Register;
