import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function ModalItemDetail({ item, onClose }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/me', {
      method: 'GET',
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => {
        console.error('Failed to fetch user:', err);
        setUser(null);
      });
  }, []);

  if (!item) return null;

  const notifySeller = async () => {
    if (!user || !user.name || !user.email) {
      alert("Please log in to contact the seller.");
      return;
    }

    try {
      const res = await fetch("/notify_seller", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          buyer_name: user.name,
          buyer_email: user.email,
          item_name: item.name,
          seller_email: item.owner_email
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Seller has been notified!");
        onClose();
      } else {
        alert(data.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error notifying seller:", error);
      alert("Failed to send email.");
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button
          className="close-btn"
          onClick={onClose}
          style={{
            fontSize: '2em',
            color: '#FF69B4',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            position: 'absolute',
            top: '10px',
            right: '20px',
            zIndex: 10
          }}
        >
          ×
        </button>

        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination]}
          style={{ borderRadius: '10px', marginBottom: '15px', maxHeight: '70vh' }}
        >
          {(item.image_paths || [item.image_path]).map((src, index) => (
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

        <h2>{item.name}</h2>
        <p>{item.description}</p>
        {item.rent_price && <p>Rent: ${item.rent_price}</p>}
        {item.buy_price && <p>Buy: ${item.buy_price}</p>}

        <button
          onClick={notifySeller}
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
  );
}

export default ModalItemDetail;
