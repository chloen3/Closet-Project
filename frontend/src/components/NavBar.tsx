import { Link } from 'react-router-dom';
import React from 'react';

// Define inline style types
const headerStyle: React.CSSProperties = {
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

const navStyle: React.CSSProperties = {
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

const linkStyle: React.CSSProperties = {
  color: '#fff',
  textDecoration: 'none',
  fontWeight: 'bold',
  padding: '5px 10px',
  borderRadius: '5px',
};

function NavBar(): JSX.Element {
  return (
    <>
      <header style={headerStyle}>
        <Link to="/home" style={{ color: '#fff', textDecoration: 'none' }}>
          Closet 1821
        </Link>
      </header>
      <nav style={navStyle}>
        <Link to="/home" style={linkStyle}>Shop</Link>
        <Link to="/add" style={linkStyle}>Add Items</Link>
        <Link to="/feedback" style={linkStyle}>Contact Us</Link>
        <Link to="/account" style={linkStyle}>Account</Link>
      </nav>
    </>
  );
}

export default NavBar;
