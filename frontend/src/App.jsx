import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Registration from './pages/Registration';
import Engineering from './pages/Engineering';
import Paramedical from './pages/Paramedical';
import Team from './pages/Team';
import Volunteer from './pages/Volunteer';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import UserPortal from './pages/UserPortal';
import TeamLogin from './pages/TeamLogin';
import TeamDashboard from './pages/TeamDashboard';
import UserDetail from './pages/UserDetail';

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Routes>
        {/* Admin routes — no navbar/footer */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* User portal routes — no navbar/footer */}
        <Route path="/portal" element={<UserPortal />} />
        <Route path="/portal/login" element={<UserLogin />} />
        <Route path="/portal/register" element={<UserRegister />} />

        {/* Team routes — no navbar/footer */}
        <Route path="/team" element={<TeamLogin />} />
        <Route path="/team/dashboard" element={<TeamDashboard />} />

        {/* Shared user detail — used by both admin and team */}
        <Route path="/user/:id" element={<UserDetail />} />

        {/* Public routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/registration" element={<PublicLayout><Registration /></PublicLayout>} />
        <Route path="/engineering" element={<PublicLayout><Engineering /></PublicLayout>} />
        <Route path="/paramedical" element={<PublicLayout><Paramedical /></PublicLayout>} />
        <Route path="/team" element={<PublicLayout><Team /></PublicLayout>} />
        <Route path="/volunteer" element={<PublicLayout><Volunteer /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      </Routes>
    </BrowserRouter>
  );
}
