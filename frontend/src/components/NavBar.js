import { Link } from 'react-router-dom';

function NavBar() {
  const logoUrl = `${process.env.PUBLIC_URL}/closet-banner.png`;

  return (
    <>
      <header style={headerStyle}>
        <img 
          src={logoUrl} 
          alt="Closet 1821 Logo" 
          style={{ height: '40px', marginRight: '12px' }} 
        />
        <Link to="/home" style={{ color: '#fff', textDecoration: 'none' }}>
          Closet 1821
        </Link>
      </header>
      …
    </>
  );
}

const headerStyle = {
  backgroundColor: '#000',
  color: '#fff',
  textAlign: 'center',
  fontSize: '2.5em',
  fontWeight: 'bold',
  padding: '20px 0',
  position: 'fixed',
  width: '100%',
  top: 0,
  zIndex: 1000,
};

const navStyle = {
  backgroundColor: '#000',
  display: 'flex',
  justifyContent: 'center',
  gap: '20px',
  padding: '10px 0',
  position: 'fixed',
  width: '100%',
  top: '80px',
  zIndex: 999,
};

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  fontWeight: 'bold',
  padding: '5px 10px',
  borderRadius: '5px',
};

export default NavBar;