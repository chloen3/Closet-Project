import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import RequireAuth from './components/RequireAuth';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Account from './pages/Account';
import Feedback from './pages/Feedback';
import AddItem from './pages/AddItem';

export default function App(): JSX.Element {
  const location = useLocation();
  const hideNav: boolean = ['/', '/login', '/register'].includes(location.pathname);

  return (
    <>
      {!hideNav && <NavBar />}

      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />

        {/* Protected */}
        <Route element={<RequireAuth />}>
          <Route path="/account" element={<Account />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/add" element={<AddItem />} />
          {/* catch‐all back to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
}
