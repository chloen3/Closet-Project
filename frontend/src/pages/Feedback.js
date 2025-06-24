import { useState } from 'react';
import NavBar from '../components/NavBar';
import { useNavigate } from 'react-router-dom';

function Feedback() {
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    fetch('/submit_feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedback })
    })
      .then(res => {
        if (res.ok) {
          alert('💖 Thanks for your feedback!');
          navigate('/home');
        } else {
          alert('Oops! Something went wrong.');
        }
      });
  };

  return (
    <>
      <NavBar />
      <main style={{ padding: '150px 20px' }}>
        <form onSubmit={handleSubmit} style={formStyle}>
          <label><strong>We'd love your feedback!</strong></label>
          <textarea
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder="Tell us how we can improve the website or features you'd like to see..."
            style={textAreaStyle}
          />
          <button type="submit" style={buttonStyle}>Submit</button>
        </form>
      </main>
    </>
  );
}

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

const formStyle = {
  maxWidth: '600px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  backgroundColor: '#fff',
  padding: '30px',
  borderRadius: '15px',
  boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
};

const textAreaStyle = {
  height: '150px',
  padding: '15px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  resize: 'none',
  fontSize: '16px'
};

const buttonStyle = {
  backgroundColor: '#FF69B4',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  padding: '12px 20px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '16px'
};

export default Feedback;
