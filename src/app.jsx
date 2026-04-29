import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/component/protectedroute';
import Layout from '@/component/layout/layout';

// Public pages
import Home from '@/page/home';
import About from '@/page/about';
import Contact from '@/page/contact';
import Partner from '@/page/partner';

// Auth pages
import Login from '@/page/login';
import Register from '@/page/register';

// Protected pages
import Dashboard from '@/page/dashboard';
import Energysystems from '@/page/energysystems';
import Energysupport from '@/page/energysupport';

// Error pages
import NotFound from '@/page/notfound';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Layout wrapper for authenticated routes */}
          <Route
            element={
              <ProtectedRoute>
                <Layout>
                  <div className="flex-1" />
                </Layout>
              </ProtectedRoute>
            }
          >
            {/* Protected pages */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/energy-systems" element={<Energysystems />} />
            <Route path="/energy-support" element={<Energysupport />} />
          </Route>

          {/* Public pages with layout */}
          <Route
            element={
              <Layout>
                <div className="flex-1" />
              </Layout>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/partner" element={<Partner />} />
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}


