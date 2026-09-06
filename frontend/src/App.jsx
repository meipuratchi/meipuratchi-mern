import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';
import ScrollProgress from './components/ScrollProgress';
import ScrollToTop from './components/ScrollToTop';
import AppPreloader from './components/AppPreloader';
import Home from './pages/Home';
import Registration from './pages/Registration';
import Engineering from './pages/Engineering';
import CProgramming from './pages/CProgramming';
import ChoiceFilling from './pages/ChoiceFilling';
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
import Tickets from './pages/Tickets';
import MeiDocs from './pages/MeiDocs';
import IlamaiyilKal from './pages/IlamaiyilKal';
import { initMobileScrollFix } from './utils/mobileScrollFix';

function PublicLayout({ children }) {
  return (
    <>
      <ScrollProgress />
      <ScrollToTop />
      <Navbar />
      <PageTransition>{children}</PageTransition>
      <Footer />
    </>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Admin routes — no navbar/footer */}
        <Route path="/admin" element={<PageTransition><AdminLogin /></PageTransition>} />
        <Route path="/admin/dashboard" element={<PageTransition><AdminDashboard /></PageTransition>} />

        {/* User portal routes — no navbar/footer */}
        <Route path="/portal" element={<PageTransition><UserPortal /></PageTransition>} />
        <Route path="/portal/login" element={<PageTransition><UserLogin /></PageTransition>} />
        <Route path="/portal/register" element={<PageTransition><UserRegister /></PageTransition>} />

        {/* Team routes — no navbar/footer */}
        <Route path="/team" element={<PageTransition><TeamLogin /></PageTransition>} />
        <Route path="/team/dashboard" element={<PageTransition><TeamDashboard /></PageTransition>} />

        {/* Shared user detail — used by both admin and team */}
        <Route path="/user/:id" element={<PageTransition><UserDetail /></PageTransition>} />

        {/* Public routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/registration" element={<PublicLayout><Registration /></PublicLayout>} />
        <Route path="/engineering" element={<PublicLayout><Engineering /></PublicLayout>} />
        <Route path="/engineering/c-programming" element={<PublicLayout><CProgramming /></PublicLayout>} />
        <Route path="/engineering/choice-filling" element={<PublicLayout><ChoiceFilling /></PublicLayout>} />
        <Route path="/paramedical" element={<PublicLayout><Paramedical /></PublicLayout>} />
        <Route path="/our-team" element={<PublicLayout><Team /></PublicLayout>} />
        <Route path="/volunteer" element={<PublicLayout><Volunteer /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/tickets" element={<PublicLayout><Tickets /></PublicLayout>} />
        <Route path="/meidocs" element={<PublicLayout><MeiDocs /></PublicLayout>} />
        <Route path="/ilamaiyil-kal" element={<PublicLayout><IlamaiyilKal /></PublicLayout>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  useEffect(() => {
    // Initialize mobile scroll fix on mount
    initMobileScrollFix();
  }, []);

  return (
    <BrowserRouter>
      <AppPreloader />
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
