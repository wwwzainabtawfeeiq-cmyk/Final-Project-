import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChefHat,
  Sparkles,
  Tag,
  LayoutDashboard,
  Package,
  Users,
  BarChart3,
  Star,
  DollarSign,
  Home,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/utils/cn';
import NavbarIcons from './NavbarIcons';
import { CustomerBadgeCompact } from '../loyalty/CustomerBadge';
import { CookBadgeCompact } from '../loyalty/CookBadge';

export default function Navbar() {
  const { t, toggle, lang } = useLanguage();
  const { count, openCart } = useCart();
  const { user, isCustomer, isCook, isAdmin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ====== روابط العميل ======
  const customerLinks = [
    { to: '/', label: t('الرئيسية', 'Home'), icon: Home },
    { to: '/meals', label: t('الأطباق', 'Meals'), icon: ChefHat },
    { to: '/cooks', label: t('الطُهاة', 'Cooks'), icon: Users },
    { to: '/flavor-match', label: 'Flavor Match', icon: Sparkles },
    { to: '/offers', label: t('العروض', 'Offers'), icon: Tag },
    { to: '/orders', label: t('طلباتي', 'Orders'), icon: Package },
  ];

  // ====== روابط الطباخ ======
  const cookLinks = [
    { to: '/cook-dashboard', label: t('لوحة التحكم', 'Dashboard'), icon: LayoutDashboard },
    { to: '/cook-dashboard?tab=orders', label: t('الطلبات', 'Orders'), icon: Package },
    { to: '/cook-dashboard?tab=menu', label: t('قائمتي', 'My Menu'), icon: ChefHat },
    { to: '/cook-dashboard?tab=reviews', label: t('التقييمات', 'Reviews'), icon: Star },
    { to: '/cook-dashboard?tab=earnings', label: t('الأرباح', 'Earnings'), icon: DollarSign },
  ];

  // ====== روابط المدير ======
  const adminLinks = [
    { to: '/admin', label: t('لوحة التحكم', 'Dashboard'), icon: LayoutDashboard },
    { to: '/admin?tab=users', label: t('المستخدمون', 'Users'), icon: Users },
    { to: '/admin?tab=orders', label: t('الطلبات', 'Orders'), icon: Package },
    { to: '/admin?tab=cooks', label: t('الطُهاة', 'Cooks'), icon: ChefHat },
    { to: '/admin?tab=overview', label: t('التقارير', 'Reports'), icon: BarChart3 },
  ];

  const currentLinks = isCook ? cookLinks : isAdmin ? adminLinks : customerLinks;

  // كشف الرابط النشط
  const isActive = (to: string) => {
    const [path, query] = to.split('?');
    if (query) {
      return (
        location.pathname === path &&
        location.search.includes(query.split('=')[1])
      );
    }
    return location.pathname === path && !location.search;
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled ? 'glass shadow-gold-sm py-2' : 'bg-transparent py-4'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
          {/* الشعار */}
          <Link
            to={isCook ? '/cook-dashboard' : isAdmin ? '/admin' : '/'}
            className="flex items-center gap-2 group shrink-0"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center gold-border">
              <span className="font-ruqaa text-2xl text-gradient-gold">ن</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-ruqaa text-xl text-gradient-gold group-hover:text-glow-gold transition-all block leading-tight">
                {t('نكهة البصرة', 'Basra Flavor')}
              </span>
              {isCook && (
                <span
                  className="font-tajawal text-[10px] block"
                  style={{ color: '#F5D76E' }}
                >
                  {t('لوحة الطباخ', 'Cook Dashboard')}
                </span>
              )}
              {isAdmin && (
                <span
                  className="font-tajawal text-[10px] block"
                  style={{ color: '#F5D76E' }}
                >
                  {t('لوحة المدير', 'Admin Dashboard')}
                </span>
              )}
            </div>
          </Link>

          {/* روابط حسب الدور */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {isCustomer ? (
              <NavbarIcons />
            ) : (
              currentLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="relative px-4 py-2 rounded-full font-tajawal text-sm font-bold transition-all flex items-center gap-2"
                    style={{
                      color: active ? '#F5D76E' : 'rgba(255, 255, 255, 0.7)',
                      background: active
                        ? 'rgba(201, 162, 39, 0.1)'
                        : 'transparent',
                    }}
                  >
                    <Icon size={16} />
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="navbarUnderline"
                        className="absolute inset-x-3 -bottom-1 h-0.5 bg-gold-bright"
                      />
                    )}
                  </Link>
                );
              })
            )}
          </div>

          {/* الأيقونات */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* تبديل لغة */}
            <button
              onClick={toggle}
              className="text-cream/70 hover:text-gold-bright font-cairo text-sm font-bold transition-colors w-10 h-10 rounded-full glass-light flex items-center justify-center"
            >
              {lang === 'ar' ? 'EN' : 'ع'}
            </button>

            {/* السلة والمفضلة - للعملاء فقط */}
            {isCustomer && (
              <>
                <button
                  onClick={openCart}
                  className="relative w-10 h-10 rounded-full glass-light flex items-center justify-center hover:gold-glow transition-all"
                >
                  <ShoppingCart size={20} className="text-gold-bright" />
                  <AnimatePresence>
                    {count > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold text-deep-black text-xs font-bold flex items-center justify-center font-cairo"
                      >
                        {count}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                <Link
                  to="/favorites"
                  className="hidden sm:flex w-10 h-10 rounded-full glass-light items-center justify-center hover:gold-glow transition-all"
                >
                  <Heart size={20} className="text-gold-bright" />
                </Link>
              </>
            )}

            {/* الشارات */}
            {isCustomer && <CustomerBadgeCompact ordersCount={5} />}
            {isCook && <CookBadgeCompact ordersCount={35} />}

            {/* الحساب/دخول */}
            {user ? (
              <Link
                to="/profile"
                className="w-10 h-10 rounded-full glass-light flex items-center justify-center hover:gold-glow transition-all"
                title={t('حسابي', 'Profile')}
              >
                <User size={20} className="text-gold-bright" />
              </Link>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="hidden md:block px-5 py-2 rounded-full font-tajawal text-sm font-bold relative overflow-hidden group"
                style={{
                  background: 'linear-gradient(135deg, #C9A227, #F5D76E)',
                }}
              >
                <span className="relative z-10 text-emerald-deep">
                  {t('دخول', 'Login')}
                </span>
                <span className="absolute inset-0 shine-bg" />
              </button>
            )}

            {/* قائمة الجوال */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-10 h-10 rounded-full glass-light flex items-center justify-center"
            >
              <Menu size={20} className="text-gold-bright" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* قائمة الجوال */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div
              className="absolute inset-0 bg-deep-black/80 backdrop-blur-2xl"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: lang === 'ar' ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: lang === 'ar' ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={cn(
                'absolute top-0 bottom-0 w-72 glass p-6 flex flex-col gap-2 overflow-y-auto',
                lang === 'ar' ? 'right-0' : 'left-0'
              )}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="font-ruqaa text-2xl text-gradient-gold">
                  {t('نكهة البصرة', 'Basra Flavor')}
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-9 h-9 rounded-full glass-light flex items-center justify-center"
                >
                  <X size={18} className="text-gold-bright" />
                </button>
              </div>

              {/* روابط حسب الدور */}
              {currentLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl font-tajawal text-base transition-all"
                    style={{
                      color: active ? '#F5D76E' : 'rgba(255, 255, 255, 0.8)',
                      background: active
                        ? 'rgba(201, 162, 39, 0.15)'
                        : 'transparent',
                    }}
                  >
                    <Icon size={20} />
                    {link.label}
                  </Link>
                );
              })}

              {/* زر الدخول */}
              {!user && (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    navigate('/login');
                  }}
                  className="mt-4 px-5 py-3 rounded-full font-tajawal font-bold relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #C9A227, #F5D76E)',
                  }}
                >
                  <span className="relative z-10 text-emerald-deep">
                    {t('دخول', 'Login')}
                  </span>
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}