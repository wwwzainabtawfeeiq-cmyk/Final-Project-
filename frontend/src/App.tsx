import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from '@/context/LanguageContext';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import Layout from '@/components/common/Layout';
import CartDrawer from '@/components/cart/CartDrawer';
import SplashScreen from '@/components/common/SplashScreen';

import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import MealsPage from '@/pages/MealsPage';
import CooksPage from '@/pages/CooksPage';
import FavoritesPage from '@/pages/FavoritesPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrdersPage from '@/pages/OrdersPage';
import ProfilePage from '@/pages/ProfilePage';
import FlavorMatchPage from '@/pages/FlavorMatchPage';

// انتقالات الصفحات
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/meals" element={<MealsPage />} />
          <Route path="/cooks" element={<CooksPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/flavor-match" element={<FlavorMatchPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const seen = sessionStorage.getItem('bf_splash_seen');
    if (seen) setShowSplash(false);
  }, []);

  const handleSplashFinish = () => {
    sessionStorage.setItem('bf_splash_seen', 'true');
    setShowSplash(false);
  };

  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
            <BrowserRouter>
              <Layout>
                <AnimatedRoutes />
              </Layout>
              <CartDrawer />
            </BrowserRouter>
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: 'rgba(15, 36, 25, 0.95)',
                  color: '#FAF6ED',
                  border: '1px solid rgba(201, 162, 39, 0.3)',
                  fontFamily: 'Tajawal, sans-serif',
                  backdropFilter: 'blur(20px)',
                },
                success: { iconTheme: { primary: '#F5D76E', secondary: '#0F2419' } },
                error: { iconTheme: { primary: '#ef4444', secondary: '#0F2419' } },
              }}
            />
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
