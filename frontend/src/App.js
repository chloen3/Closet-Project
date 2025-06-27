import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Account from './pages/Account';
import Feedback from './pages/Feedback';
import Landing from './pages/Landing';
import AddItem from './pages/AddItem';

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/add" element={<AddItem />} />
      </Routes>
    </>
  );
}

export default App;
