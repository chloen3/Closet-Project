import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';

function Account() {
  const [user, setUser] = useState({});
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        return fetch(`/get_user_items?owner_email=${encodeURIComponent(data.email)}`);
      })
      .then(res => res.json())
      .then(data => setItems(data.items))
      .catch(err => console.error('Error:', err));
  }, []);

  const deleteItem = id => {
    fetch(`/delete_item/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
      .then(() => setItems(prev => prev.filter(i => i.id !== id)))
      .catch(err => console.error('Error deleting item:', err));
  };

  return (
    <>
      <NavBar />
      <main style={{ padding: '150px 20px' }}>
        <h2>Hello, {user.name || 'Guest'}!</h2>
        <h3>Your Posted Items:</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '20px',
          justifyContent: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {items.map(item => (
            <div key={item.id} style={cardStyle}>
              <button onClick={() => deleteItem(item.id)} style={btnStyle}>✖</button>
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
  borderRadius: '12px',
  padding: '10px',
  background: '#fff',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  textAlign: 'center',
  position: 'relative',
  width: '100%',
  maxWidth: '220px',
  margin: '0 auto'
};

const btnStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  background: 'transparent',
  border: 'none',
  fontSize: '20px',
  cursor: 'pointer',
  color: '#FF69B4'
};

export default Account;
