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
import WelcomeOffersModal from '@/components/offers/WelcomeOffersModal';
import AIChatAssistant from '@/components/ai/AIChatAssistant';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import MealsPage from '@/pages/MealsPage';
import CooksPage from '@/pages/CooksPage';
import CookProfilePage from '@/pages/CookProfilePage';
import CookDashboard from '@/pages/CookDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import FavoritesPage from '@/pages/FavoritesPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrdersPage from '@/pages/OrdersPage';
import OrderDetailsPage from '@/pages/OrderDetailsPage';
import ProfilePage from '@/pages/ProfilePage';
import FlavorMatchPage from '@/pages/FlavorMatchPage';
import OffersPage from '@/pages/OffersPage';
import SubscriptionPage from '@/pages/SubscriptionPage';
import SurplusAndCharityPage from '@/pages/SurplusAndCharityPage';
import ChefBarterMarket from '@/pages/ChefBarterMarket';
import SecretRecipeMarket from '@/pages/SecretRecipeMarket';

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
          <Route path="/cook/:id" element={<CookProfilePage />} />
          <Route path="/cook-dashboard" element={<CookDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/flavor-match" element={<FlavorMatchPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/subscriptions" element={<SubscriptionPage />} />
          <Route path="/surplus-and-charity" element={<SurplusAndCharityPage />} />
          <Route path="/chef-barter" element={<ChefBarterMarket />} />
          <Route path="/secret-recipes" element={<SecretRecipeMarket />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const splashSeen = sessionStorage.getItem('bf_splash_seen');
    if (splashSeen) setShowSplash(false);
  }, []);

  useEffect(() => {
    if (!showSplash) {
      const welcomeSeen = sessionStorage.getItem('bf_welcome_seen');
      if (!welcomeSeen) {
        const timer = setTimeout(() => setShowWelcome(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [showSplash]);

  const handleSplashFinish = () => {
    sessionStorage.setItem('bf_splash_seen', 'true');
    setShowSplash(false);
  };

  const handleCloseWelcome = () => {
    sessionStorage.setItem('bf_welcome_seen', 'true');
    setShowWelcome(false);
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
              <AIChatAssistant />
              {showWelcome && (
                <WelcomeOffersModal onClose={handleCloseWelcome} />
              )}
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
                success: {
                  iconTheme: { primary: '#F5D76E', secondary: '#0F2419' },
                },
                error: {
                  iconTheme: { primary: '#ef4444', secondary: '#0F2419' },
                },
              }}
            />
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}