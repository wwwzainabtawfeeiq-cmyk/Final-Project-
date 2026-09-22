import { useState } from 'react';
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

// Cook Components & Pages
import CookDashboard from './pages/cook/CookDashboard';
import CookOrdersKanban from './pages/cook/CookOrdersKanban';
import FairPriceCalculator from './pages/cook/FairPriceCalculator';
import ChefBarterMarket from './pages/cook/ChefBarterMarket';
import SecretRecipeMarket from './pages/cook/SecretRecipeMarket';
import AddEditMealModal from './pages/cook/AddEditMealModal';

// Admin Components & Pages
import AdminDashboard from './pages/admin/AdminDashboard';

// Lucide Icons
import { ChefHat, ShoppingBag, Calculator, RefreshCw, BookOpen } from 'lucide-react';

function MainApp() {
  const { activePortal } = useCart();

  // Customer State
  const [customerTab, setCustomerTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cook State
  const [cookTab, setCookTab] = useState('dashboard');
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Top Global Portal Switcher Bar */}
      <TopPortalBar />

      {/* ========================================================
          1. CUSTOMER PORTAL (واجهة الزبون)
         ======================================================== */}
      {activePortal === 'customer' && (
        <>
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

          {/* Cart Drawer */}
          {isCartOpen && <CartDrawerModal onClose={() => setIsCartOpen(false)} />}
        </>
      )}

      {/* ========================================================
          2. COOK PORTAL (واجهة الطباخ)
         ======================================================== */}
      {activePortal === 'cook' && (
        <>
          <header style={{ background: '#ffffff', borderBottom: '2px solid #e6d5c3', padding: '14px 20px', position: 'sticky', top: 0, zIndex: 40 }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#5c3a21', display: 'flex', alignItems: 'center', gap: 8 }}>
                <ChefHat size={22} color="#2d5a27" /> بوابة الطباخ البصري 👨‍🍳
              </div>

              <div style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
                {[
                  { id: 'dashboard', label: 'لوحة التحكم', icon: ChefHat },
                  { id: 'orders', label: 'إدارة الطلبات', icon: ShoppingBag },
                  { id: 'fair-price', label: 'حاسبة السعر العادل', icon: Calculator },
                  { id: 'barter', label: 'مقايضة الطباخين', icon: RefreshCw },
                  { id: 'secret-recipes', label: 'الوصفات السرية', icon: BookOpen }
                ].map(t => {
                  const Icon = t.icon;
                  const isActive = cookTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setCookTab(t.id)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 12,
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        border: '1.5px solid',
                        borderColor: isActive ? '#5c3a21' : '#e6d5c3',
                        background: isActive ? '#5c3a21' : '#ffffff',
                        color: isActive ? 'white' : '#6e5849',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        transition: 'all 0.2s'
                      }}
                    >
                      <Icon size={15} /> {t.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </header>

          <main className="main-content">
            {cookTab === 'dashboard' && (
              <CookDashboard
                onOpenAddMeal={() => setIsAddMealOpen(true)}
                onNavigateCookTab={setCookTab}
              />
            )}
            {cookTab === 'orders' && <CookOrdersKanban />}
            {cookTab === 'fair-price' && <FairPriceCalculator />}
            {cookTab === 'barter' && <ChefBarterMarket />}
            {cookTab === 'secret-recipes' && <SecretRecipeMarket />}
          </main>

          {/* Add/Edit Meal Modal */}
          {isAddMealOpen && <AddEditMealModal onClose={() => setIsAddMealOpen(false)} />}
        </>
      )}

      {/* ========================================================
          3. ADMIN PORTAL (واجهة الأدمن)
         ======================================================== */}
      {activePortal === 'admin' && (
        <main className="main-content">
          <AdminDashboard />
        </main>
      )}

      {/* Basra Footer */}
      <footer className="app-footer">
        <div className="footer-inner">
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#faf6ee', marginBottom: 6 }}>
              منصة نكهة البصرة (Basra Flavor) 🍲
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#d4a373' }}>
              المنصة المتكاملة لخدمة أطباق البصرة الأصيلة من بيوت الطباخين المحترفين مع حاسبة السعر العادل وجسر التبرع.
            </p>
          </div>
          <div style={{ fontSize: '0.82rem', color: '#d4a373' }}>
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
