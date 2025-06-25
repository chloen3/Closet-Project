import React, { useEffect, useState } from 'react';

function ModalItemDetail({ item, onClose }) {
  const [user, setUser] = useState(null); // you can call setUser later to update user state (initially null)

  // fetch user from the cloud (via /me) on mount
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

  // No item = don't render
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
        <button className="close-btn" onClick={onClose}>×</button>

        <div className="carousel">
          {item.photos?.map((photo, idx) => (
            <img
              key={idx}
              src={photo}
              alt={`item ${idx}`}
              style={{
                width: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
                borderRadius: '10px',
                marginBottom: '10px'
              }}              
            />
          ))}
        </div>

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
