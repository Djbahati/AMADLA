import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/component/protectedroute';
import Layout from '@/component/layout/layout';

import Home from '@/page/home';
import About from '@/page/about';
import Contact from '@/page/contact';
import Partner from '@/page/partner';
import Projects from '@/page/projects';
import Quote from '@/page/quote';
import Login from '@/page/login';
import Register from '@/page/register';
import Dashboard from '@/page/dashboard';
import Energysystems from '@/page/energysystems';
import Energysupport from '@/page/energysupport';
import NotFound from '@/page/notfound';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Public pages with layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/quote" element={<Quote />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/partner" element={<Partner />} />
          </Route>

          {/* Protected pages with layout */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/energy-systems" element={<Energysystems />} />
            <Route path="/energy-support" element={<Energysupport />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
