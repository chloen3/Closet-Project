import { useState } from 'react';
import NavBar from '../components/NavBar';
import { useNavigate } from 'react-router-dom';

function Feedback() {

  // hook initializatoin
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();

  // runs on submit button click
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
      <main style={containerStyle}>
        <form onSubmit={handleSubmit} style={formStyle}>
          <label><strong>We'd love your feedback!</strong></label>
          <textarea
            className="styled-input"
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder="Tell us how we can improve..."
         />

          <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FF1493'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FF69B4'}
          >
            Submit
          </button>
        </form>
      </main>
    </>
  );
}

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  minHeight: '100vh',
  paddingTop: '190px',
  backgroundColor: '#fff'
};

const formStyle = {
  maxWidth: '600px',
  width: '100%',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  backgroundColor: '#fff',
  padding: '40px',
  borderRadius: '15px',
  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
  textAlign: 'center'
};

const textAreaStyle = {
  height: '150px',
  padding: '15px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  resize: 'none',
  fontSize: '16px',
  outline: 'none',
  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  boxSizing: 'border-box'
};

const buttonStyle = {
  backgroundColor: '#FF69B4',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  padding: '12px 20px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '16px',
  transition: 'background-color 0.3s ease'
};

export default Feedback;
