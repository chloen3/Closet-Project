import { useNavigate } from 'react-router-dom';

function Landing() {

// another hook
  const navigate = useNavigate();

  
  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Welcome to Closet 1821</h1>
      <p style={subtextStyle}>Rent, sell, buy — effortlessly.</p>
      <div style={buttonGroupStyle}>
        <button style={buttonStyle} onClick={() => navigate('/login')}>Log In</button>
        <button style={buttonStyle} onClick={() => navigate('/register')}>Create Account</button>
      </div>
    </div>
  );
}

const containerStyle = {
  fontFamily: 'Arial, sans-serif',
  backgroundColor: '#fff',
  color: '#000',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
};

const titleStyle = {
  fontSize: '2.5em',
  marginBottom: '10px'
};

const subtextStyle = {
  fontSize: '1.2em',
  marginBottom: '30px',
  color: '#333'
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '15px'
};

const buttonStyle = {
  backgroundColor: '#000',
  color: '#fff',
  border: 'none',
  padding: '12px 24px',
  fontSize: '1em',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease, transform 0.2s ease'
};

export default Landing;
