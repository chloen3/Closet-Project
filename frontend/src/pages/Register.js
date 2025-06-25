import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const register = async () => {
    const { name, email, password } = form;
    if (!name || !email || !password) return alert('All fields required.');

    // API call to flask
    const res = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (data.message) navigate('/home');
    else alert(data.error || 'Registration failed');
  };

  // JSX return, HTML rednering
  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <h2>Create Account</h2>
        <input placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
        <button onClick={register}>Sign Up</button>
        <p>Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
}

// CSS styling
const containerStyle = {
  display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#fff'
};

const formStyle = {
  width: '320px', padding: '30px', background: '#f9f9f9', borderRadius: '10px', boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
  display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'center'
};

export default Register;
