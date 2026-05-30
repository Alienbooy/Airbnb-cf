import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PublicRoute, ProtectedRoute } from './routes/guards';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import HomePage       from './pages/guest/HomePage';
import ListingsPage   from './pages/guest/ListingsPage';
import ListingDetail  from './pages/guest/ListingDetailPage';
import GuestDashboard from './pages/guest/GuestDashboard';

import HostDashboard  from './pages/host/HostDashboard';
import HostListings   from './pages/host/HostListings';
import NewListing     from './pages/host/NewListingPage';

import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Auth */}
        <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        {/* Guest / Public */}
        <Route path="/"                  element={<HomePage />} />
        <Route path="/listings"          element={<ListingsPage />} />
        <Route path="/listings/:id"      element={<ListingDetail />} />
        <Route path="/dashboard"         element={<ProtectedRoute roles={['guest']}><GuestDashboard /></ProtectedRoute>} />

        {/* Host */}
        <Route path="/host"              element={<ProtectedRoute roles={['host']}><HostDashboard /></ProtectedRoute>} />
        <Route path="/host/listings"     element={<ProtectedRoute roles={['host']}><HostListings /></ProtectedRoute>} />
        <Route path="/host/listings/new" element={<ProtectedRoute roles={['host']}><NewListing /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin"             element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<div style={{color:'#fff',textAlign:'center',padding:'4rem'}}>404 — Página no encontrada</div>} />
      </Routes>
    </AuthProvider>
  );
}
