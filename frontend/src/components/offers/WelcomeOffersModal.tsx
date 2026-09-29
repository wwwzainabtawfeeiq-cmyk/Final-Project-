import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, Sparkles, Gift, Percent, Clock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const OFFERS = [
  {
    id: 1,
    title: { ar: 'خصم 20%', en: '20% OFF' },
    subtitle: { ar: 'بمناسبة اليوم الوطني', en: 'National Day Special' },
    icon: Sparkles,
    color: 'from-[#C9A227] to-[#F5D76E]',
    link: '/offers',
    badge: { ar: 'عرض اليوم', en: "Today's Deal" },
  },
  {
    id: 2,
    title: { ar: 'توصيل مجاني', en: 'Free Delivery' },
    subtitle: { ar: 'لأول طلب', en: 'On First Order' },
    icon: Gift,
    color: 'from-[#1B4332] to-[#2D5A3D]',
    link: '/meals',
    badge: { ar: 'للعملاء الجدد', en: 'New Customers' },
  },
  {
    id: 3,
    title: { ar: 'خصم 15%', en: '15% OFF' },
    subtitle: { ar: 'اشتراك شهري', en: 'Monthly Subscription' },
    icon: Percent,
    color: 'from-[#8B6914] to-[#C9A227]',
    link: '/subscriptions',
    badge: { ar: 'الأكثر طلبًا', en: 'Most Popular' },
  },
  {
    id: 4,
    title: { ar: 'تحدي الطهي', en: 'Cooking Challenge' },
    subtitle: { ar: 'اربح طبخك مجانًا', en: 'Win Free Cooking' },
    icon: Clock,
    color: 'from-[#5C3A21] to-[#8B6914]',
    link: '/challenges',
    badge: { ar: 'جديد', en: 'New' },
  },
];

export default function WelcomeOffersModal({ onClose }: { onClose: () => void }) {
  const { t, lang } = useLanguage();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        {/* الخلفية */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
          onClick={onClose}
        />

        {/* النافذة */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: 'spring', damping: 22, stiffness: 250 }}
          className="relative w-full max-w-2xl rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0F2419 0%, #1B4332 50%, #0F2419 100%)',
            border: '2px solid rgba(201, 162, 39, 0.4)',
            boxShadow: '0 25px 80px rgba(201, 162, 39, 0.4)',
          }}
        >
          {/* زر الإغلاق */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full glass-light flex items-center justify-center hover:bg-gold/20 transition-all"
          >
            <X size={20} className="text-gold-bright" />
          </button>

          {/* هالة علوية */}
          <div
            className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 0%, rgba(201,162,39,0.4), transparent 70%)',
            }}
          />

          <div className="relative z-10 p-8 md:p-10">
            {/* العنوان */}
            <div className="text-center mb-8">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                style={{ background: 'linear-gradient(135deg, #C9A227, #F5D76E)' }}
              >
                <Gift size={32} className="text-emerald-deep" />
              </motion.div>
              <h2 className="font-ruqaa text-3xl md:text-4xl text-gradient-gold mb-2">
                {t('عروض حصرية لك!', 'Exclusive Offers for You!')}
              </h2>
              <p className="font-tajawal text-cream/60">
                {t('اختر العرض الذي يناسبك وابدأ الطلب', 'Pick the offer that suits you and start ordering')}
              </p>
            </div>

            {/* العروض */}
            <div className="grid grid-cols-2 gap-4">
              {OFFERS.map((offer, i) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <Link
                    to={offer.link}
                    onClick={onClose}
                    className="block group"
                  >
                    <div
                      className={`relative rounded-2xl p-5 overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl`}
                      style={{
                        background: `linear-gradient(135deg, ${offer.color.split(' ')[0].replace('from-[', '').replace(']', '')} 0%, ${offer.color.split(' ')[1].replace('to-[', '').replace(']', '')} 100%)`,
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                      }}
                    >
                      {/* Badge */}
                      <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-black/40 text-white text-[10px] font-bold font-tajawal">
                        {offer.badge[lang as 'ar' | 'en']}
                      </span>

                      <offer.icon size={28} className="text-white mb-3" />

                      <div className="font-ruqaa text-2xl text-white mb-1">
                        {offer.title[lang as 'ar' | 'en']}
                      </div>
                      <div className="font-tajawal text-white/80 text-xs">
                        {offer.subtitle[lang as 'ar' | 'en']}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* زر التخطي */}
            <button
              onClick={onClose}
              className="w-full mt-6 py-3 rounded-full font-tajawal text-sm text-cream/50 hover:text-gold-bright transition-colors"
            >
              {t('تخطي — تصفح الموقع مباشرة', 'Skip — Browse site directly')}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}