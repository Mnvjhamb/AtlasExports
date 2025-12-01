import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import Home from '@/pages/Home';
import Products from '@/pages/Products';
import ProductDetail from '@/pages/ProductDetail';
import About from '@/pages/About';
import Reviews from '@/pages/Reviews';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/not-found';

import AdminLogin from '@/pages/admin/AdminLogin';
import AdminLayout from '@/pages/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminCategories from '@/pages/admin/AdminCategories';
import AdminReviews from '@/pages/admin/AdminReviews';
import AdminContacts from '@/pages/admin/AdminContacts';
import AdminContent from '@/pages/admin/AdminContent';
import AdminClients from '@/pages/admin/AdminClients';

// Check if we're on an admin subdomain (admin.theatlasexports.com, dev.admin.theatlasexports.com, etc.)
const isAdminHost = (() => {
  const host = window.location.hostname;
  return host.includes('admin.');
})();

function PublicLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

function AdminRoutes() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate(isAdminHost ? '/' : '/admin');
  };

  return (
    <AdminLayout onLogout={handleLogout}>
      <Routes>
        <Route
          path="/"
          element={<AdminDashboard />}
        />
        <Route
          path="/dashboard"
          element={<AdminDashboard />}
        />
        <Route
          path="/products"
          element={<AdminProducts />}
        />
        <Route
          path="/categories"
          element={<AdminCategories />}
        />
        <Route
          path="/reviews"
          element={<AdminReviews />}
        />
        <Route
          path="/contacts"
          element={<AdminContacts />}
        />
        <Route
          path="/clients"
          element={<AdminClients />}
        />
        <Route
          path="/content"
          element={<AdminContent />}
        />
        <Route
          path="*"
          element={<AdminDashboard />}
        />
      </Routes>
    </AdminLayout>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}

function ProtectedAdminRoute() {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return isAdmin ? <AdminRoutes /> : <AdminLogin />;
}

function PublicPage({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <PublicLayoutWrapper>
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>{children}</PageTransition>
      </AnimatePresence>
    </PublicLayoutWrapper>
  );
}

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Toaster />
      <Routes>
        {/* Root path behaves differently based on host */}
        <Route
          path="/"
          element={
            isAdminHost ? (
              <ProtectedAdminRoute />
            ) : (
              <PublicPage>
                <Home />
              </PublicPage>
            )
          }
        />

        {/* Admin routes - available on both hosts */}
        <Route
          path="/admin/*"
          element={<ProtectedAdminRoute />}
        />

        {/* Public routes - only show if not on admin host */}
        {!isAdminHost && (
          <>
            <Route
              path="/products"
              element={
                <PublicPage>
                  <Products />
                </PublicPage>
              }
            />
            <Route
              path="/products/:id"
              element={
                <PublicPage>
                  <ProductDetail />
                </PublicPage>
              }
            />
            <Route
              path="/about"
              element={
                <PublicPage>
                  <About />
                </PublicPage>
              }
            />
            <Route
              path="/reviews"
              element={
                <PublicPage>
                  <Reviews />
                </PublicPage>
              }
            />
            <Route
              path="/contact"
              element={
                <PublicPage>
                  <Contact />
                </PublicPage>
              }
            />
          </>
        )}

        {/* Catch-all route */}
        <Route
          path="*"
          element={
            isAdminHost ? (
              <ProtectedAdminRoute />
            ) : (
              <PublicPage>
                <NotFound />
              </PublicPage>
            )
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
