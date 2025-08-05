import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';

// Type definitions
interface User {
  name?: string;
  email?: string;
}

interface Item {
  id: string;
  name: string;
  description: string;
  rent_price?: string;
  buy_price?: string;
  image_path: string;
  image_paths?: string[];
  owner_email: string;
  category: string;
}

function Account(): JSX.Element {
  const [user, setUser] = useState<User>({});
  const [items, setItems] = useState<Item[]>([]);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/me', { credentials: 'include' })
      .then(res => res.json())
      .then((data: User) => {
        setUser(data);
        return fetch(`/get_user_items?owner_email=${encodeURIComponent(data.email || '')}`);
      })
      .then(res => res.json())
      .then(data => setItems(data.items))
      .catch(err => console.error('Error:', err));
  }, []);

  const deleteItem = (id: string) => {
    fetch(`/delete_item/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then(() => setItems(prev => prev.filter(i => i.id !== id)))
      .catch(err => console.error('Error deleting item:', err));
  };

  return (
    <>
      <NavBar />
      <main style={{ padding: '150px 20px' }}>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h2>Hello, {user.name || 'Guest'}!</h2>
          <h3>Your Posted Items:</h3>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
            justifyContent: 'center',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          {items.map(item => (
            <div
              key={item.id}
              style={{
                ...cardStyle,
                transform: hoveredCardId === item.id ? 'scale(1.05)' : 'scale(1)',
                boxShadow:
                  hoveredCardId === item.id
                    ? '0 6px 12px rgba(0,0,0,0.15)'
                    : '0 4px 8px rgba(0,0,0,0.1)',
              }}
              onMouseEnter={() => setHoveredCardId(item.id)}
              onMouseLeave={() => setHoveredCardId(null)}
            >
              <button
                onClick={() => {
                  const confirmed = window.confirm(
                    `Are you sure you want to delete "${item.name}"?`
                  );
                  if (confirmed) {
                    deleteItem(item.id);
                  }
                }}
                style={btnStyle as React.CSSProperties}
                onMouseEnter={e => (e.currentTarget.style.color = '#FF1493')}
                onMouseLeave={e => (e.currentTarget.style.color = '#FF69B4')}
              >
                ✖
              </button>
              <img
                src={
                  hoveredCardId === item.id && item.image_paths?.[1]
                    ? item.image_paths[1]
                    : item.image_path
                }
                alt={item.name}
                style={{
                  width: '100%',
                  height: '260px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  transition: 'transform 0.4s ease, opacity 0.4s ease',
                  transform: 'scale(1)',
                  boxShadow: 'none',
                  zIndex: 1,
                  position: 'relative',
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

// Inline styles
const cardStyle: React.CSSProperties = {
  borderRadius: '12px',
  padding: '10px',
  background: '#fff',
  textAlign: 'center',
  position: 'relative',
  width: '100%',
  maxWidth: '220px',
  margin: '0 auto',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  cursor: 'pointer',
};

const btnStyle: React.CSSProperties = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  background: 'transparent',
  border: 'none',
  fontSize: '40px',
  cursor: 'pointer',
  color: '#FF69B4',
  transition: 'color 0.2s ease',
  zIndex: 2,
};

export default Account;
