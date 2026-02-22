import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { getToken, getRole } from './services/storage.js';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Tickets from './pages/Tickets.jsx';
import Settings from './pages/Settings.jsx';
import ManageUsers from './pages/ManageUsers.jsx';

export const ProtectedRoute = () => {
  if (!getToken()) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />;
};

export const AdminRoute = () => {
  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }
  if (getRole() !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/settings" element={<Settings />} />
          <Route element={<AdminRoute />}>
            <Route path="/manage-users" element={<ManageUsers />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;