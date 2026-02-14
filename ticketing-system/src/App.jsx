import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { getToken } from './services/storage.js';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';

export const ProtectedRoute = () => {
  if (!getToken()) {
    return <Navigate to="/login" replace />
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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;