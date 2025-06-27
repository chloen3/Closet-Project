import { Link } from 'react-router-dom';

import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <>
      <header style={headerStyle}>
        <div style={headerInnerStyle}>
          <img
            src="/closet-logo.png"
            alt="Closet 1821 Logo"
            style={logoStyle}
          />
          <Link to="/home" style={titleLinkStyle}>Closet 1821</Link>
        </div>
      </header>

      <nav style={navStyle}>
        <Link to="/home" style={linkStyle}>Shop</Link>
        <Link to="/add" style={linkStyle}>Add Items</Link>
        <Link to="/account" style={linkStyle}>Account</Link>
        <Link to="/feedback" style={linkStyle}>Feedback</Link>
      </nav>
    </>
  );
}
const logoStyle = {
  height: '50px',
  marginRight: '12px',
};

const headerInnerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
};


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
