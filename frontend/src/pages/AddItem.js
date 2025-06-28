import { useState } from 'react';
import NavBar from '../components/NavBar';
import { useNavigate } from 'react-router-dom';

// All possible categories in the app
const ALL_CATEGORIES = ['shirt','pants','dress','shorts','shoes','accessories'];

export default function AddItem() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    rent_price: '',
    buy_price: ''
  });
  const [isRent, setIsRent] = useState(false);
  const [isBuy, setIsBuy] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const [labelOptions, setLabelOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [otherCategory, setOtherCategory] = useState('');

  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async e => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
    setLabelOptions([]);
    setSelectedCategory('');
    setOtherCategory('');

    const fd = new FormData();
    files.forEach(f => fd.append('images', f));

    try {
      const res = await fetch('/predict_labels', { method: 'POST', body: fd });
      const { predictions } = await res.json();
      setLabelOptions(predictions);
      setSelectedCategory(predictions[0] || '');
    } catch (err) {
      console.error('Predict labels error:', err);
    }
  };

  // Build dropdown order: predicted first, then remaining categories, then 'other'
  const dropdownOptions = [
    ...labelOptions,
    ...ALL_CATEGORIES.filter(c => !labelOptions.includes(c)),
    'other'
  ];

  const handlePriceFocus = field => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].startsWith('$') ? prev[field] : '$' + prev[field]
    }));
  };

  const submit = () => {
    if (!form.name || selectedImages.length === 0)
      return alert('Name and at least one image are required.');
    if (!selectedCategory)
      return alert('Please select a category.');
    if (isRent && !form.rent_price)
      return alert('Please enter a rent price.');
    if (isBuy && !form.buy_price)
      return alert('Please enter a buy price.');

    const data = new FormData();
    data.append('name', form.name);
    data.append('description', form.description);
    data.append('rent_price', isRent ? form.rent_price.replace(/^\$/, '') : '');
    data.append('buy_price', isBuy ? form.buy_price.replace(/^\$/, '') : '');

    const categoryToSend =
      selectedCategory === 'other'
        ? otherCategory.trim().toLowerCase()
        : selectedCategory;
    data.append('category', categoryToSend);

    selectedImages.forEach(img => data.append('images', img));

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
            className="styled-input"
            placeholder="Item Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            onFocus={e => e.currentTarget.style.outline = '2px solid #FF69B4'}
            onBlur={e => e.currentTarget.style.outline = 'none'}
          />

          <textarea
            className="styled-input"
            placeholder="Description (size, brand, etc.)"
            name="description"
            value={form.description}
            onChange={handleChange}
            style={{ height: '100px', resize: 'none' }}
            onFocus={e => e.currentTarget.style.outline = '2px solid #FF69B4'}
            onBlur={e => e.currentTarget.style.outline = 'none'}
          />

          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={isRent}
              onChange={() => setIsRent(prev => !prev)}
              style={checkboxStyle}
            />
            Rent
          </label>
          {isRent && (
            <input
              className="styled-input"
              placeholder="Rent Price"
              name="rent_price"
              value={form.rent_price}
              onFocus={() => handlePriceFocus('rent_price')}
              onChange={handleChange}
              onFocusCapture={e => e.currentTarget.style.outline = '2px solid #FF69B4'}
              onBlur={e => e.currentTarget.style.outline = 'none'}
            />
          )}

          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={isBuy}
              onChange={() => setIsBuy(prev => !prev)}
              style={checkboxStyle}
            />
            Buy
          </label>
          {isBuy && (
            <input
              className="styled-input"
              placeholder="Buy Price"
              name="buy_price"
              value={form.buy_price}
              onFocus={() => handlePriceFocus('buy_price')}
              onChange={handleChange}
              onFocusCapture={e => e.currentTarget.style.outline = '2px solid #FF69B4'}
              onBlur={e => e.currentTarget.style.outline = 'none'}
            />
          )}

          <input
            className="styled-input"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            style={{ padding: '6px' }}
            onFocus={e => e.currentTarget.style.outline = '2px solid #FF69B4'}
            onBlur={e => e.currentTarget.style.outline = 'none'}
          />

          {/* Dropdown for category sorted by AI likelihood */}
          {dropdownOptions.length > 0 && (
            <label style={dropdownLabelStyle}>
              Category:
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                style={dropdownStyle}
                onFocus={e => e.currentTarget.style.outline = '2px solid #FF69B4'}
                onBlur={e => e.currentTarget.style.outline = 'none'}
              >
                {dropdownOptions.map(opt => (
                  <option key={opt} value={opt}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </option>
                ))}
              </select>
            </label>
          )}

          {selectedCategory === 'other' && (
            <input
              type="text"
              placeholder="Enter category"
              value={otherCategory}
              onChange={e => setOtherCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '6px',
                marginTop: '4px',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
              onFocus={e => e.currentTarget.style.outline = '2px solid #FF69B4'}
              onBlur={e => e.currentTarget.style.outline = 'none'}
            />
          )}

          <button
            onClick={submit}
            style={buttonStyle}
            onMouseEnter={e => (e.target.style.backgroundColor = '#FF1493')}
            onMouseLeave={e => (e.target.style.backgroundColor = '#FF69B4')}
          >
            Submit
          </button>
        </div>
      </main>
    </>
  );
}

// Styles
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  minHeight: '100vh',
  paddingTop: '190px',
  backgroundColor: '#fff'
};

const formStyle = {
  fontFamily: 'Arial, sans-serif',
  width: '350px',
  padding: '40px',
  background: '#f9f9f9',
  borderRadius: '16px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  textAlign: 'center'
};

const checkboxLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '1em',
  fontWeight: '500',
  cursor: 'pointer'
};

const checkboxStyle = {
  accentColor: '#000',
  cursor: 'pointer'
};

const dropdownLabelStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  marginTop: '12px',
  fontSize: '1em',
  fontWeight: '500'
};

const dropdownStyle = {
  marginTop: '4px',
  padding: '6px',
  width: '100%',
  borderRadius: '4px',
  border: '1px solid #ccc'
};

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
