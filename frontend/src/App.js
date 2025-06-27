import { Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import RequireAuth from './components/RequireAuth'; 

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Account from './pages/Account';
import Feedback from './pages/Feedback';
import Landing from './pages/Landing';
import AddItem from './pages/AddItem';

function App() {
  const location = useLocation();
  const hideNavPaths = ['/', '/login', '/register'];

  return (
    <>
      {!hideNavPaths.includes(location.pathname) && <NavBar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/home" element={
          <RequireAuth><Home /></RequireAuth>
        } />
        <Route path="/account" element={
          <RequireAuth><Account /></RequireAuth>
        } />
        <Route path="/feedback" element={
          <RequireAuth><Feedback /></RequireAuth>
        } />
        <Route path="/add" element={
          <RequireAuth><AddItem /></RequireAuth>
        } />
      </Routes>
    </>
  );
}

export default App;
