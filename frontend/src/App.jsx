import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PublicRoute, ProtectedRoute } from './routes/guards';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Lazy placeholders — to be developed incrementally
import { lazy, Suspense } from 'react';

const HomePage       = lazy(() => import('./pages/guest/HomePage'));
const ListingsPage   = lazy(() => import('./pages/guest/ListingsPage'));
const ListingDetail  = lazy(() => import('./pages/guest/ListingDetailPage'));
const GuestDashboard = lazy(() => import('./pages/guest/GuestDashboard'));

const HostDashboard  = lazy(() => import('./pages/host/HostDashboard'));
const HostListings   = lazy(() => import('./pages/host/HostListings'));
const NewListing     = lazy(() => import('./pages/host/NewListingPage'));

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

function Loading() {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#0a0a0f' }}>
      <div style={{ width:32, height:32, border:'3px solid rgba(255,90,60,0.2)', borderTopColor:'#ff5a3c', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
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
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
