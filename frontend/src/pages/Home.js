import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

// componenet function reads current state and props and renders them to the screen
// in React.js, updates go to the Virtual DOM which then only updates the Real DOM with changes --> efficiency
function Home() {

  // hook intiitalizatoin on mount
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // s1: hook initiailziation - "mounting"
  useEffect(() => {
    fetch('/get_items')
      .then(res => res.json())
      .then(data => setItems(data.items)) // s2: updating
      .catch(err => console.error('Error fetching items:', err));
  }, []);
  // s3: unmounting - not done here

  const toggleCategory = (cat) => {
    setSelectedCategories(prev => {
      if (cat === 'all') {
        // if “all” is already on, uncheck everything; otherwise turn on only “all”
        return prev.includes('all') ? [] : ['all'];
      }
      // if pick any real category, remove “all” from the list
      const withoutAll = prev.filter(c => c !== 'all');
      // then toggle this category
      return withoutAll.includes(cat)
        ? withoutAll.filter(c => c !== cat)
        : [...withoutAll, cat];
    });
  };

  const filteredItems =
  selectedCategories.length === 0 ||
  selectedCategories.includes('all')
    ? items
    : items.filter(item =>
        selectedCategories.includes(item.category)
      );

  return (
    <>
      <NavBar />
      <main style={{ display: 'flex', paddingTop: '150px', paddingBottom: '50px' }}>
        {/* Sidebar */}
        <div style={sidebarStyle}>
          <h3>Filter by Category</h3>
          {['all', 'dresses', 'shirts', 'shorts', 'skirts', 'pants', 'shoes', 'accessories'].map(cat => (
            <label key={cat} style={{ display: 'flex', alignItems: 'center', margin: '6px 0', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                style={{ marginRight: '8px', accentColor: '#FF69B4' }}
              />
              <span style={{ textTransform: 'capitalize' }}>{cat}</span>
            </label>
          ))}
        </div>

        {/* Grid */}
        <div style={gridStyle}>
          {filteredItems.map(item => (
            <div
              key={item.id}
              style={{
                ...cardStyle,
                transform: hoveredCardId === item.id ? 'scale(1.05)' : 'scale(1)',
                boxShadow: hoveredCardId === item.id
                  ? '0 6px 12px rgba(0,0,0,0.15)'
                  : '0 4px 8px rgba(0,0,0,0.1)'
              }}
              onClick={() => setSelectedItem(item)}
              onMouseEnter={() => setHoveredCardId(item.id)}
              onMouseLeave={() => setHoveredCardId(null)}
            >
              <img
                src={
                  hoveredCardId === item.id && item.image_paths?.[1]
                    ? item.image_paths[1]
                    : item.image_path
                }
                alt={item.name}
                style={imageStyle}
              />
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              {item.rent_price && <p>Rent: ${item.rent_price}</p>}
              {item.buy_price && <p>Buy: ${item.buy_price}</p>}
              <p style={{ fontSize: '0.9em', color: '#999' }}>{item.category}</p>
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
              loop={true}
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
                const confirmNotify = window.confirm(`Are you sure you want to notify the seller about "${selectedItem.name}"?`);
                if (!confirmNotify) return;

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
                padding: '12px 24px',
                borderRadius: '8px',
                border: '2px solid black',
                backgroundColor: '#fff',
                color: '#000',
                fontWeight: 'bold',
                fontSize: '1em',
                cursor: 'pointer',
                marginTop: '15px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => {
                e.target.style.backgroundColor = '#000';
                e.target.style.color = '#fff';
              }}
              onMouseLeave={e => {
                e.target.style.backgroundColor = '#fff';
                e.target.style.color = '#000';
              }}
            >
              Notify Seller
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const sidebarStyle = {
  minWidth: '180px',
  padding: '20px',
  borderRight: '1px solid #eee',
  fontSize: '1em',
  fontWeight: '500'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '10px',
  justifyContent: 'center',
  maxWidth: '1200px',
  margin: '0 auto',
  paddingLeft: '20px',
  flex: 1
};

const cardStyle = {
  borderRadius: '10px',
  padding: '10px',
  background: '#fff',
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
  borderRadius: '10px',
  transition: 'transform 0.4s ease, opacity 0.4s ease',
  transform: 'scale(1)',
  boxShadow: 'none'
};

export default Home;
