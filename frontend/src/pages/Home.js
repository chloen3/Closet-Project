import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

function Home() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

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
        <div style={gridStyle}>
          {items.map(item => (
            <div
              key={item.id}
              style={cardStyle}
              onClick={() => setSelectedItem(item)}
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
                style={imageStyle}
              />
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              {item.rent_price && <p>Rent: ${item.rent_price}</p>}
              {item.buy_price && <p>Buy: ${item.buy_price}</p>}
            </div>
          ))}
        </div>
      </main>

      {selectedItem && (
        <div className="modal-backdrop" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>

            <Swiper
              spaceBetween={10}
              slidesPerView={1}
              navigation
              modules={[Navigation]}
              style={{
                marginBottom: '15px',
                borderRadius: '10px',
                maxHeight: '70vh',
                width: '100%',
              }}
            >
              {(selectedItem.image_paths || [selectedItem.image_path]).map((src, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={src}
                    alt={`item-${index}`}
                    style={{
                      width: '100%',
                      maxHeight: '70vh',
                      objectFit: 'contain',
                      borderRadius: '10px'
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <h2>{selectedItem.name}</h2>
            <p>{selectedItem.description}</p>
            {selectedItem.rent_price && <p>Rent: ${selectedItem.rent_price}</p>}
            {selectedItem.buy_price && <p>Buy: ${selectedItem.buy_price}</p>}

            <button
              onClick={async () => {
                const res = await fetch('/me', { credentials: 'include' });
                const user = await res.json();

                if (!user.email || !user.name) {
                  alert('Please log in to contact the seller.');
                  return;
                }

                const response = await fetch('/notify_seller', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'include',
                  body: JSON.stringify({
                    buyer_name: user.name,
                    buyer_email: user.email,
                    item_name: selectedItem.name,
                    seller_email: selectedItem.owner_email
                  })
                });

                const data = await response.json();
                if (response.ok) {
                  alert('Seller has been notified!');
                  setSelectedItem(null);
                } else {
                  alert(data.error || 'Failed to notify seller.');
                }
              }}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#FF69B4',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '1em',
                cursor: 'pointer',
                marginTop: '15px',
                transition: 'background-color 0.3s ease'
              }}
              onMouseEnter={e => (e.target.style.backgroundColor = '#FF1493')}
              onMouseLeave={e => (e.target.style.backgroundColor = '#FF69B4')}
            >
              Notify Seller
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: '20px',
  justifyContent: 'center',
  maxWidth: '1200px',
  margin: '0 auto'
};

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

const imageStyle = {
  width: '100%',
  height: '260px',
  objectFit: 'cover',
  borderRadius: '10px'
};

export default Home;
