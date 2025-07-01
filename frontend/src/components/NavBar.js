import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <>
      <header style={headerStyle}>
        <img
          src={`${process.env.PUBLIC_URL}/banneridea_1.png`}
          alt="Closet 1821 Banner"
          style={bannerImgStyle}
        />
        <Link to="/home" style={titleLinkStyle}>
          Closet 1821
        </Link>
      </header>

      <nav style={navStyle}>
        <Link to="/home"    style={linkStyle}>Shop</Link>
        <Link to="/add"     style={linkStyle}>Add Items</Link>
        <Link to="/feedback"style={linkStyle}>Contact Us</Link>
        <Link to="/account" style={linkStyle}>Account</Link>
      </nav>
    </>
  );
}

const headerHeight = 120; // px — must match your banner image’s height

const headerStyle = {
  display:       'flex',
  alignItems:    'center',
  justifyContent:'center',
  backgroundColor:'#000',
  position:      'fixed',
  top:           0,
  width:         '100%',
  height:        `${headerHeight}px`,
  zIndex:        1000,
};

const bannerImgStyle = {
  height:       '100%',
  marginRight:  '15px',
};

const titleLinkStyle = {
  color:         '#fff',
  textDecoration:'none',
  fontSize:      '2.5em',
  fontWeight:    'bold',
};

const navStyle = {
  display:        'flex',
  justifyContent: 'center',
  gap:            '20px',
  backgroundColor:'#000',
  position:       'fixed',
  top:            `${headerHeight}px`,
  width:          '100%',
  padding:        '10px 0',
  zIndex:         999,
};

const linkStyle = {
  color:         '#fff',
  textDecoration:'none',
  fontWeight:   'bold',
  padding:      '5px 10px',
  borderRadius: '5px',
};

export default NavBar;
