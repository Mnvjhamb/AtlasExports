import { useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import About from "@/pages/About";
import ClientPortal from "@/pages/ClientPortal";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";

import AdminLogin from "@/pages/admin/AdminLogin";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminReviews from "@/pages/admin/AdminReviews";
import AdminContacts from "@/pages/admin/AdminContacts";
import AdminContent from "@/pages/admin/AdminContent";

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function PublicRouter() {
  return (
    <PublicLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/products" component={Products} />
        <Route path="/products/:id" component={ProductDetail} />
        <Route path="/about" component={About} />
        <Route path="/client-portal" component={ClientPortal} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </PublicLayout>
  );
}

function AdminRouter({ onLogout }: { onLogout: () => void }) {
  return (
    <AdminLayout onLogout={onLogout}>
      <Switch>
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/admin/products" component={AdminProducts} />
        <Route path="/admin/categories" component={AdminCategories} />
        <Route path="/admin/reviews" component={AdminReviews} />
        <Route path="/admin/contacts" component={AdminContacts} />
        <Route path="/admin/content" component={AdminContent} />
        <Route>
          <AdminDashboard />
        </Route>
      </Switch>
    </AdminLayout>
  );
}

function App() {
  const [location, setLocation] = useLocation();
  // todo: remove mock functionality - replace with Firebase auth state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const isAdminRoute = location.startsWith("/admin");

  const handleLogin = () => {
    setIsAdminLoggedIn(true);
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setLocation("/admin");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          {isAdminRoute ? (
            isAdminLoggedIn ? (
              <AdminRouter onLogout={handleLogout} />
            ) : (
              <AdminLogin onLogin={handleLogin} />
            )
          ) : (
            <PublicRouter />
          )}
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
