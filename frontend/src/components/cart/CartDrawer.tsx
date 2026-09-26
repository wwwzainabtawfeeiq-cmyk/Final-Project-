import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/mockData';
import { cn } from '@/utils/cn';

export default function CartDrawer() {
  const { t, lang } = useLanguage();
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, count } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80]"
        >
          <div className="absolute inset-0 bg-deep-black/70 backdrop-blur-sm" onClick={closeCart} />
          <motion.div
            initial={{ x: lang === 'ar' ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: lang === 'ar' ? '100%' : '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className={cn('absolute top-0 bottom-0 w-full max-w-md glass flex flex-col', lang === 'ar' ? 'right-0' : 'left-0')}
          >
            {/* رأس */}
            <div className="flex items-center justify-between p-5 border-b border-gold/20">
              <div className="flex items-center gap-2">
                <ShoppingBag size={22} className="text-gold-bright" />
                <h2 className="font-ruqaa text-2xl text-gradient-gold">{t('سلة التسوق', 'Shopping Cart')}</h2>
              </div>
              <button onClick={closeCart} className="w-9 h-9 rounded-full glass-light flex items-center justify-center hover:gold-glow transition-all">
                <X size={18} className="text-gold-bright" />
              </button>
            </div>

            {/* العناصر */}
            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <div className="w-24 h-24 rounded-full glass-light flex items-center justify-center">
                    <ShoppingBag size={40} className="text-gold/40" />
                  </div>
                  <p className="text-cream/50 font-tajawal text-lg">{t('سلتك فارغة', 'Your cart is empty')}</p>
                  <Link to="/meals" onClick={closeCart}
                    className="px-6 py-2.5 rounded-full font-tajawal font-bold relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #C9A227, #F5D76E)' }}>
                    <span className="relative z-10 text-emerald-deep">{t('تصفح الأطباق', 'Browse Meals')}</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {items.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: lang === 'ar' ? 50 : -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: lang === 'ar' ? 50 : -50, height: 0 }}
                        transition={{ delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                        className="flex gap-3 p-3 rounded-xl glass-light"
                      >
                        <img src={item.image} alt={lang === 'ar' ? item.name : item.nameEn}
                          className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1">
                          <h3 className="font-tajawal text-cream text-sm font-bold mb-1">
                            {lang === 'ar' ? item.name : item.nameEn}
                          </h3>
                          <p className="font-cairo text-gold-bright text-sm">{formatPrice(item.price)}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-lg glass flex items-center justify-center hover:gold-glow transition-all">
                              <Minus size={14} className="text-gold-bright" />
                            </button>
                            <span className="font-cairo text-cream w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-lg glass flex items-center justify-center hover:gold-glow transition-all">
                              <Plus size={14} className="text-gold-bright" />
                            </button>
                            <button onClick={() => removeItem(item.id)}
                              className="w-7 h-7 rounded-lg glass flex items-center justify-center hover:bg-red-900/30 transition-all mr-auto">
                              <Trash2 size={14} className="text-red-400" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* التذييل */}
            {items.length > 0 && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="p-5 border-t border-gold/20 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-tajawal text-cream/70">{t('المجموع', 'Total')}</span>
                  <span className="font-cairo text-2xl text-gradient-gold">{formatPrice(total)}</span>
                </div>
                <Link to="/checkout" onClick={closeCart}
                  className="block w-full py-3.5 rounded-xl font-tajawal font-bold text-center relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #C9A227, #F5D76E)' }}>
                  <span className="relative z-10 text-emerald-deep text-lg">
                    {t('إتمام الطلب', 'Checkout')} ({count})
                  </span>
                  <span className="absolute inset-0 shine-bg" />
                </Link>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
