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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {items.map(item => (
            <div key={item.id} style={cardStyle}>
              <img src={item.image_path} alt={item.name} style={{ width: '100%', borderRadius: '10px' }} />
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
    borderRadius: '12px',
    padding: '10px',
    background: '#fff',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    textAlign: 'center'
  };  

export default Home;
