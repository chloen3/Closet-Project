import React from 'react';
import ModalItemDetail from '../components/ModalItemDetails';

function ModalItemDetail({ item, onClose }) {
  if (!item) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="carousel">
          {item.photos.map((photo, idx) => (
            <img key={idx} src={photo} alt={`item ${idx}`} />
          ))}
        </div>
        <h2>{item.name}</h2>
        <p>{item.description}</p>
        <p><strong>Price:</strong> ${item.price}</p>
      </div>
    </div>
  );
}

export default ModalItemDetail;
