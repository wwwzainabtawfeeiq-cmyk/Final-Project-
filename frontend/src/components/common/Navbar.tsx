import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, User, Menu, X, UtensilsCrossed, ChefHat, Sparkles, Tag } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/utils/cn';

export default function Navbar() {
  const { t, toggle, lang } = useLanguage();
  const { count, openCart } = useCart();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { to: '/', label: t('الرئيسية', 'Home'), icon: UtensilsCrossed },
    { to: '/meals', label: t('الأطباق', 'Meals'), icon: ChefHat },
    { to: '/cooks', label: t('الطُهاة', 'Cooks'), icon: ChefHat },
    { to: '/flavor-match', label: 'Flavor Match', icon: Sparkles },
    { to: '/orders', label: t('طلباتي', 'Orders'), icon: Tag },
  ];

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
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* الشعار */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full flex items-center justify-center gold-border">
              <span className="font-ruqaa text-2xl text-gradient-gold">ن</span>
            </div>
            <span className="font-ruqaa text-xl text-gradient-gold group-hover:text-glow-gold transition-all hidden sm:block">
              {t('نكهة البصرة', 'Basra Flavor')}
            </span>
          </Link>

          {/* روابط سطح المكتب */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map(link => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="relative px-4 py-2 text-cream/80 hover:text-gold-bright font-tajawal transition-colors group"
                >
                  {link.label}
                  <span className={cn(
                    'absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-gold to-gold-bright transition-all duration-300',
                    active ? 'w-3/4' : 'w-0 group-hover:w-3/4'
                  )} />
                </Link>
              );
            })}
          </div>

          {/* أيقونات */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* تبديل لغة */}
            <button
              onClick={toggle}
              className="text-cream/70 hover:text-gold-bright font-cairo text-sm font-bold transition-colors w-10 h-10 rounded-full glass-light flex items-center justify-center"
            >
              {lang === 'ar' ? 'EN' : 'ع'}
            </button>

            {/* السلة */}
            <button onClick={openCart} className="relative w-10 h-10 rounded-full glass-light flex items-center justify-center hover:gold-glow transition-all">
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

            {/* المفضلة */}
            <Link to="/favorites" className="hidden sm:flex w-10 h-10 rounded-full glass-light items-center justify-center hover:gold-glow transition-all">
              <Heart size={20} className="text-gold-bright" />
            </Link>

            {/* الحساب/دخول */}
            {user ? (
              <Link to="/profile" className="w-10 h-10 rounded-full glass-light flex items-center justify-center hover:gold-glow transition-all">
                <User size={20} className="text-gold-bright" />
              </Link>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="hidden md:block px-5 py-2 rounded-full font-tajawal text-sm font-bold relative overflow-hidden group"
                style={{ background: 'linear-gradient(135deg, #C9A227, #F5D76E)' }}
              >
                <span className="relative z-10 text-emerald-deep">{t('دخول', 'Login')}</span>
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
            <div className="absolute inset-0 bg-deep-black/80 backdrop-blur-2xl" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: lang === 'ar' ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: lang === 'ar' ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={cn('absolute top-0 bottom-0 w-72 glass p-6 flex flex-col gap-2', lang === 'ar' ? 'right-0' : 'left-0')}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="font-ruqaa text-2xl text-gradient-gold">{t('نكهة البصرة', 'Basra Flavor')}</span>
                <button onClick={() => setMobileOpen(false)} className="w-9 h-9 rounded-full glass-light flex items-center justify-center">
                  <X size={18} className="text-gold-bright" />
                </button>
              </div>
              {links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-cream/80 hover:text-gold-bright hover:bg-gold/10 font-tajawal text-lg transition-all"
                >
                  <link.icon size={20} />
                  {link.label}
                </Link>
              ))}
              {!user && (
                <button
                  onClick={() => { setMobileOpen(false); navigate('/login'); }}
                  className="mt-4 px-5 py-3 rounded-full font-tajawal font-bold relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #C9A227, #F5D76E)' }}
                >
                  <span className="relative z-10 text-emerald-deep">{t('دخول', 'Login')}</span>
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
