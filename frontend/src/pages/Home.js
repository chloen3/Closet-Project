import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';

function Home() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/get_items')
      .then(res => res.json())
      .then(data => setItems(data.items))
      .catch(err => console.error('Error fetching items:', err));
  }, []);

  return (
    <>
      <NavBar />
      <main style={{ padding: '150px 20px 50px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '20px',
          justifyContent: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {items.map(item => (
            <div
              key={item.id}
              style={cardStyle}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
              }}
            >
              <img
                src={item.image_path}
                alt={item.name}
                style={{
                  width: '100%',
                  height: '260px',
                  objectFit: 'cover',
                  borderRadius: '10px'
                }}
              />
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              {item.rent_price && <p>Rent: ${item.rent_price}</p>}
              {item.buy_price && <p>Buy: ${item.buy_price}</p>}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

const cardStyle = {
  borderRadius: '10px',
  padding: '10px',
  background: '#fff',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  textAlign: 'center',
  width: '100%',
  maxWidth: '220px',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  cursor: 'pointer'
};

export default Home;
