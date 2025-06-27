import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';

function Account() {
  const [user, setUser] = useState({});
  const [items, setItems] = useState([]);
  const [hoveredCardId, setHoveredCardId] = useState(null);

  // NEW: which item is in “edit mode” and its form fields
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rent_price: '',
    buy_price: ''
  });

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
      .then(() =>
        setItems(prev => prev.filter(i => i.id !== id))
      )
      .catch(err => console.error('Error deleting item:', err));
  };

  // NEW: start editing, prefill form
  const handleEditClick = item => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      rent_price: item.rent_price ?? '',
      buy_price: item.buy_price ?? ''
    });
  };

  // NEW: update form fields
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  // NEW: submit updated item
  const handleUpdate = id => {
    fetch(`/edit_item/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => {
        if (!res.ok) throw new Error('Update failed');
        return res.json();
      })
      .then(updatedItem => {
        setItems(prev =>
          prev.map(i => (i.id === id ? updatedItem : i))
        );
        setEditingItem(null);
      })
      .catch(err => console.error('Error updating item:', err));
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
            margin: '0 auto'
          }}
        >
          {items.map(item => {
            const isEditing = editingItem?.id === item.id;

            return (
              <div
                key={item.id}
                style={{
                  ...cardStyle,
                  transform: hoveredCardId === item.id ? 'scale(1.05)' : 'scale(1)',
                  boxShadow:
                    hoveredCardId === item.id
                      ? '0 6px 12px rgba(0,0,0,0.15)'
                      : '0 4px 8px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={() => setHoveredCardId(item.id)}
                onMouseLeave={() => setHoveredCardId(null)}
              >
                {isEditing ? (
                  // ——— EDIT FORM ———
                  <>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Name"
                    />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Description"
                    />
                    <input
                      name="rent_price"
                      type="number"
                      value={formData.rent_price}
                      onChange={handleChange}
                      placeholder="Rent Price"
                    />
                    <input
                      name="buy_price"
                      type="number"
                      value={formData.buy_price}
                      onChange={handleChange}
                      placeholder="Buy Price"
                    />
                    <div style={{ marginTop: '10px' }}>
                      <button
                        onClick={() => handleUpdate(item.id)}
                        style={{ marginRight: '8px' }}
                      >
                        Save
                      </button>
                      <button onClick={() => setEditingItem(null)}>
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  // ——— NORMAL CARD ———
                  <>
                    <button
                      onClick={() => handleEditClick(item)}
                      style={{
                        position: 'absolute',
                        top:  '10px',
                        left: '10px',
                        background: 'transparent',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: '#888'
                      }}
                    >
                      ✎
                    </button>

                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to delete "${item.name}"?`
                          )
                        ) {
                          deleteItem(item.id);
                        }
                      }}
                      style={btnStyle}
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
                        zIndex: 1,
                        position: 'relative'
                      }}
                    />
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    {item.rent_price && <p>Rent: ${item.rent_price}</p>}
                    {item.buy_price && <p>Buy: ${item.buy_price}</p>}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}

const cardStyle = {
  borderRadius: '12px',
  padding: '10px',
  background: '#fff',
  textAlign: 'center',
  position: 'relative',
  width: '100%',
  maxWidth: '220px',
  margin: '0 auto',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  cursor: 'pointer'
};

const btnStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  background: 'transparent',
  border: 'none',
  fontSize: '40px',
  cursor: 'pointer',
  color: '#FF69B4',
  transition: 'color 0.2s ease',
  zIndex: 2
};

export default Account;
