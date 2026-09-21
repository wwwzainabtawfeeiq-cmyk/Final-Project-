import React, { useState } from 'react';
import './App.css';
import { CartProvider, useCart } from './context/CartContext';

// Common Components
import TopPortalBar from './components/common/TopPortalBar';

// Customer Components & Pages
import CustomerNavbar from './components/customer/CustomerNavbar';
import CustomerSubNav from './components/customer/CustomerSubNav';
import CustomerHome from './pages/customer/CustomerHome';
import FlavorMatchPage from './pages/customer/FlavorMatchPage';
import CustomAndGroupOrderPage from './pages/customer/CustomAndGroupOrderPage';
import WeeklyMealPlanPage from './pages/customer/WeeklyMealPlanPage';
import ChallengesPage from './pages/customer/ChallengesPage';
import SurplusAndCharityPage from './pages/customer/SurplusAndCharityPage';
import CartDrawerModal from './components/customer/CartDrawerModal';

function MainApp() {
  const { activePortal } = useCart();

  // Customer State
  const [customerTab, setCustomerTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Top Global Portal Switcher Bar */}
      <TopPortalBar />

      {/* CUSTOMER PORTAL ONLY */}
      <CustomerNavbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenFlavorMatch={() => setCustomerTab('flavor-match')}
      />

      <CustomerSubNav
        activeTab={customerTab}
        setActiveTab={setCustomerTab}
      />

      <main className="main-content">
        {['all', 'night', 'breakfast', 'favorites'].includes(customerTab) && (
          <CustomerHome
            searchTerm={searchTerm}
            activeCategory={customerTab}
            setActiveCategory={setCustomerTab}
            onOpenFlavorMatch={() => setCustomerTab('flavor-match')}
          />
        )}

        {customerTab === 'flavor-match' && <FlavorMatchPage />}
        {customerTab === 'custom-group' && <CustomAndGroupOrderPage />}
        {customerTab === 'weekly-plan' && <WeeklyMealPlanPage />}
        {customerTab === 'challenges' && <ChallengesPage />}
        {customerTab === 'surplus' && <SurplusAndCharityPage />}
      </main>

      {/* Cart Drawer Modal */}
      {isCartOpen && <CartDrawerModal onClose={() => setIsCartOpen(false)} />}

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-inner">
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', marginBottom: 6 }}>
              منصة نكهة البصرة (Basra Flavor) 🍲
            </h3>
            <p style={{ fontSize: '0.85rem' }}>
              واجهة الزبون المتكاملة للتصفح، الطلب الصوتي، التوصيات، والجدولة الأسبوعية.
            </p>
          </div>
          <div style={{ fontSize: '0.82rem' }}>
            © 2026 نكهة البصرة. جميع الحقوق محفوظة.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <MainApp />
    </CartProvider>
  );
}
