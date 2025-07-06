import { Link } from 'react-router-dom';
import banner from '../assets/banneridea_1.png';

const HEADER_HEIGHT = 135; // ← set this to your banner’s real height in px

function NavBar() {
  return (
    <>
      <header style={headerStyle}>
        <Link to="/home" style={titleStyle}>
          Closet 1821
        </Link>
      </header>

      <nav style={navStyle}>
        <Link to="/home"     style={linkStyle}>Shop</Link>
        <Link to="/add"      style={linkStyle}>Add Items</Link>
        <Link to="/feedback" style={linkStyle}>Contact Us</Link>
        <Link to="/account"  style={linkStyle}>Account</Link>
      </nav>
    </>
  );
}

const headerStyle = {
  position:          'fixed',
  top:               0,
  left:              0,
  width:             '100%',
  height:            `${HEADER_HEIGHT}px`,
  backgroundImage: `url(${banner})`,
  backgroundSize:    'cover',
  backgroundPosition:'center',
  display:           'flex',
  alignItems:        'center',
  justifyContent:    'center',
  zIndex:            1000,
};

const titleStyle = {
  color:           '#fff',
  textDecoration:  'none',
  fontSize:        '3rem',       // tweak to taste
  fontWeight:      'bold',
  textShadow:      '0 2px 4px rgba(0,0,0,0.6)',
};

const navStyle = {
  position:       'fixed',
  top:            `${HEADER_HEIGHT}px`,
  left:           0,
  width:          '100%',
  backgroundColor:'#000',
  display:        'flex',
  justifyContent: 'center',
  gap:            '35px',
  padding:        '5px 0',
  zIndex:         999,
};

const linkStyle = {
  color:          '#fff',
  textDecoration: 'none',
  fontWeight:     'bold',
};

export default NavBar;
