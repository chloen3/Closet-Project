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
      <main style={{ padding: '150px 20px' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h2>Add New Item</h2>
          <input placeholder="Item Name" name="name" onChange={handleChange} />
          <textarea placeholder="Description" name="description" onChange={handleChange} />
          <input placeholder="Rent Price" name="rent_price" onChange={handleChange} />
          <input placeholder="Buy Price" name="buy_price" onChange={handleChange} />
          <input type="file" accept="image/*" onChange={handleImage} />
          <button onClick={submit} style={{ backgroundColor: '#000', color: '#fff', padding: '10px' }}>Submit</button>
        </div>
      </main>
    </>
  );
}

const formStyle = {
    background: '#fff',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    maxWidth: '500px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  };
  

export default AddItem;
