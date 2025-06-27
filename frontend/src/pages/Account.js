import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';

export default function Account() {
  const [user, setUser] = useState({});
  const [items, setItems] = useState([]);
  const [hoveredCardId, setHoveredCardId] = useState(null);

  // Track which item we're editing, plus its form data
  const [editingItemId, setEditingItemId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rent_price: '',
    buy_price: ''
  });

  // Load user + their items
  useEffect(() => {
    fetch('/me', { credentials: 'include' })
      .then(r => r.json())
      .then(u => {
        setUser(u);
        return fetch(`/get_user_items?owner_email=${encodeURIComponent(u.email)}`);
      })
      .then(r => r.json())
      .then(data => setItems(data.items))
      .catch(console.error);
  }, []);

  const deleteItem = id =>
    fetch(`/delete_item/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
      .then(() => setItems(prev => prev.filter(i => i.id !== id)))
      .catch(console.error);

  // Start editing: set the ID and pre-fill the form
  const startEdit = item => {
    setEditingItemId(item.id);
    setFormData({
      name: item.name,
      description: item.description,
      rent_price: item.rent_price || '',
      buy_price: item.buy_price || ''
    });
  };

  // Update form fields
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  // Save edits
  const saveEdit = async id => {
    try {
      const res = await fetch(`/edit_item/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Update failed');
      const updated = await res.json();
      setItems(prev => prev.map(i => (i.id === id ? updated : i)));
      setEditingItemId(null);
    } catch (err) {
      console.error(err);
      alert('Could not save changes.');
    }
  };

  return (
    <>
      <NavBar />
      <main style={{ padding: '150px 20px' }}>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h2>Hello, {user.name || 'Guest'}!</h2>
          <h3>Your Posted Items:</h3>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '10px',
          justifyContent: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {items.map(item => {
            const isEditing = editingItemId === item.id;

            return (
              <div
                key={item.id}
                style={{
                  ...cardStyle,
                  transform: hoveredCardId === item.id ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: hoveredCardId === item.id
                    ? '0 6px 12px rgba(0,0,0,0.15)'
                    : '0 4px 8px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={() => setHoveredCardId(item.id)}
                onMouseLeave={() => setHoveredCardId(null)}
              >
                {isEditing ? (
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
                        onClick={() => saveEdit(item.id)}
                        style={{ marginRight: '8px' }}
                      >
                        Save
                      </button>
                      <button onClick={() => setEditingItemId(null)}>
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Edit button */}
                    <button
                      onClick={() => startEdit(item)}
                      style={editBtnStyle}
                    >
                      ✎
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete "${item.name}"?`)) {
                          deleteItem(item.id);
                        }
                      }}
                      style={btnStyle}
                    >
                      ✖
                    </button>

                    {/* Thumbnail */}
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

const editBtnStyle = {
  position: 'absolute',
  top: '10px',
  left: '10px',
  background: 'transparent',
  border: 'none',
  fontSize: '24px',
  cursor: 'pointer',
  color: '#888',
  zIndex: 2
};
