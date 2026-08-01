import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar    from './components/Navbar';
import Footer    from './components/Footer';
import Home      from './pages/Home';
import JobDetail from './pages/JobDetail';
import Apply     from './pages/Apply';
import Register  from './pages/Register';
import Login     from './pages/Login';
import Portal    from './pages/Portal';
import Terms     from './pages/Terms';
import Privacy   from './pages/Privacy';

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh' }}>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Routes>
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/jobs/:id" element={<PublicLayout><JobDetail /></PublicLayout>} />
        <Route path="/apply/:id" element={<PublicLayout><Apply /></PublicLayout>} />
        <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
        <Route path="/portal" element={<Portal />} />
        <Route path="/terms" element={<PublicLayout><Terms /></PublicLayout>} />
        <Route path="/privacy" element={<PublicLayout><Privacy /></PublicLayout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
