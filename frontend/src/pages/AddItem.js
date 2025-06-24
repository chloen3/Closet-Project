import { useState } from 'react';
import NavBar from '../components/NavBar';
import { useNavigate } from 'react-router-dom';

function AddItem() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    rent_price: '',
    buy_price: '',
    image: null
  });

  const [isRent, setIsRent] = useState(false);
  const [isBuy, setIsBuy] = useState(false);

  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImage = e => {
    setForm(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const submit = () => {
    if (!form.name || !form.image) return alert('Name and image are required.');
    if (isRent && !form.rent_price) return alert('Please enter a rent price.');
    if (isBuy && !form.buy_price) return alert('Please enter a buy price.');

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));

    fetch('/add_item', {
      method: 'POST',
      body: data,
      credentials: 'include'
    })
      .then(res => res.json())
      .then(() => {
        alert('Item added!');
        navigate('/home');
      })
      .catch(err => alert('Upload failed: ' + err));
  };

  return (
    <>
      <NavBar />
      <main style={containerStyle}>
        <div style={formStyle}>
          <h2>Add New Item</h2>
          <input
            placeholder="Item Name"
            name="name"
            onChange={handleChange}
            style={inputStyle}
          />
          <textarea
            placeholder="Description (size, brand, etc.)"
            name="description"
            onChange={handleChange}
            style={{ ...inputStyle, height: '100px', resize: 'none' }}
          />

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <label>
              <input
                type="checkbox"
                checked={isRent}
                onChange={() => setIsRent(prev => !prev)}
                style={{ marginRight: '6px' }}
              />
              Rent
            </label>
            <label>
              <input
                type="checkbox"
                checked={isBuy}
                onChange={() => setIsBuy(prev => !prev)}
                style={{ marginRight: '6px' }}
              />
              Buy
            </label>
          </div>

          {isRent && (
            <input
              placeholder="Rent Price"
              name="rent_price"
              onChange={handleChange}
              style={inputStyle}
            />
          )}
          {isBuy && (
            <input
              placeholder="Buy Price"
              name="buy_price"
              onChange={handleChange}
              style={inputStyle}
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            style={{ ...inputStyle, padding: '6px' }}
          />

          <button
            onClick={submit}
            style={buttonStyle}
            onMouseEnter={e => e.target.style.backgroundColor = '#FF1493'}
            onMouseLeave={e => e.target.style.backgroundColor = '#FF69B4'}
          >
            Submit
          </button>
        </div>
      </main>
    </>
  );
}

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  minHeight: '100vh',
  paddingTop: '120px',
  backgroundColor: '#fff'
};

const formStyle = {
  width: '350px',
  padding: '30px',
  background: '#f9f9f9',
  borderRadius: '16px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  textAlign: 'center'
};

const inputStyle = {
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  fontSize: '1em',
  outline: 'none',
  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  boxSizing: 'border-box'
};

document.addEventListener('focusin', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
    e.target.style.borderColor = '#FF69B4';
    e.target.style.boxShadow = '0 0 0 2px rgba(255, 105, 180, 0.2)';
  }
});
document.addEventListener('focusout', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
    e.target.style.borderColor = '#ccc';
    e.target.style.boxShadow = 'none';
  }
});

const buttonStyle = {
  padding: '12px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#FF69B4',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '1em',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease'
};

export default AddItem;
