import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminLogin     from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminCMS       from './pages/AdminCMS';
import TeamLogin      from './pages/TeamLogin';
import TeamDashboard  from './pages/TeamDashboard';
import UserDetail     from './pages/UserDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Routes>
        {/* Default → admin login */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* Admin */}
        <Route path="/admin"           element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Team */}
        <Route path="/team"            element={<TeamLogin />} />
        <Route path="/team/dashboard"  element={<TeamDashboard />} />

        {/* Shared user detail */}
        <Route path="/user/:id"        element={<UserDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
