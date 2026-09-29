import { useState } from 'react';
import { Crown, X, TrendingUp, Gift, Award, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const CUSTOMER_TIERS = [
  {
    min: 20,
    ar: 'عميل بلاتيني',
    en: 'Platinum Customer',
    discount: 20,
    icon: Award,
    color: 'from-[#E5E4E2] to-[#C9A227]',
    perks: {
      ar: ['خصم 20% دائم', 'توصيل مجاني دائم', 'هدايا شهرية', 'دعم VIP 24/7'],
      en: ['20% permanent discount', 'Free permanent delivery', 'Monthly gifts', 'VIP 24/7 support'],
    },
  },
  {
    min: 10,
    ar: 'عميل ذهبي',
    en: 'Gold Customer',
    discount: 15,
    icon: Crown,
    color: 'from-[#C9A227] to-[#F5D76E]',
    perks: {
      ar: ['خصم 15%', 'توصيل مجاني', 'هدية عيد ميلاد'],
      en: ['15% discount', 'Free delivery', 'Birthday gift'],
    },
  },
  {
    min: 5,
    ar: 'عميل فضي',
    en: 'Silver Customer',
    discount: 10,
    icon: Star,
    color: 'from-[#B8B8B8] to-[#E5E4E2]',
    perks: {
      ar: ['خصم 10%', 'أولوية في الطلبات'],
      en: ['10% discount', 'Priority orders'],
    },
  },
];

function getCustomerTier(ordersCount: number) {
  return CUSTOMER_TIERS.find((t) => ordersCount >= t.min) || null;
}

// ============ الشارة المصغرة (Navbar) ============
export function CustomerBadgeCompact({ ordersCount }: { ordersCount: number }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const tier = getCustomerTier(ordersCount);

  if (!tier) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden sm:flex items-center gap-1.5 rounded-full border border-gold/40 text-gold-bright text-[11px] px-3 py-1.5 font-tajawal hover:bg-gold/15 hover:border-gold-bright transition-all cursor-pointer"
      >
        <Crown size={12} />
        {t(tier.ar, tier.en)}
      </button>

      <CustomerModal
        open={open}
        onClose={() => setOpen(false)}
        ordersCount={ordersCount}
        tier={tier}
      />
    </>
  );
}

// ============ النافذة المنبثقة ============
function CustomerModal({
  open,
  onClose,
  ordersCount,
  tier,
}: {
  open: boolean;
  onClose: () => void;
  ordersCount: number;
  tier: (typeof CUSTOMER_TIERS)[number];
}) {
  const { t } = useLanguage();
  const nextTier = [...CUSTOMER_TIERS].reverse().find((t) => t.min > ordersCount);
  const progress = nextTier ? Math.min(100, (ordersCount / nextTier.min) * 100) : 100;
  const TierIcon = tier.icon;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl" onClick={onClose} />

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 22, stiffness: 250 }}
            className="relative w-full max-w-md rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #0F2419 0%, #1B4332 50%, #0F2419 100%)',
              border: '2px solid rgba(201, 162, 39, 0.4)',
              boxShadow: '0 25px 80px rgba(201, 162, 39, 0.4)',
            }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full glass-light flex items-center justify-center hover:bg-gold/20 transition-all"
            >
              <X size={18} className="text-gold-bright" />
            </button>

            <div
              className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 50% 0%, rgba(201,162,39,0.4), transparent 70%)',
              }}
            />

            <div className="relative z-10 p-8">
              <div className="text-center mb-6">
                <motion.div
                  animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 bg-gradient-to-br ${tier.color}`}
                >
                  <TierIcon size={40} className="text-emerald-deep" />
                </motion.div>

                <h2 className="font-ruqaa text-3xl text-gradient-gold mb-1">
                  {t(tier.ar, tier.en)}
                </h2>
                <p className="font-tajawal text-cream/60 text-sm">
                  {ordersCount} {t('طلب مكتمل', 'completed orders')}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-xs font-tajawal text-cream/60 mb-2">
                  <span>{t('المستوى الحالي', 'Current tier')}</span>
                  {nextTier && (
                    <span className="text-gold-bright">
                      {nextTier.min - ordersCount}{' '}
                      {t('طلب للمستوى التالي', 'orders to next tier')}
                    </span>
                  )}
                </div>
                <div className="h-3 rounded-full bg-black-deep/60 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full"
                    style={{ background: 'linear-gradient(90deg, #C9A227, #F5D76E)' }}
                  />
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Gift size={16} className="text-gold-bright" />
                  <h3 className="font-tajawal font-bold text-cream text-sm">
                    {t('مزاياك الحالية', 'Your current perks')}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {tier.perks.ar.map((_, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      className="flex items-center gap-2 font-tajawal text-sm text-cream/80"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-bright" />
                      {t(tier.perks.ar[i], tier.perks.en[i])}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {nextTier ? (
                <div className="rounded-2xl p-4 border border-gold/30 bg-gold/5">
                  <div className="flex items-start gap-3">
                    <TrendingUp size={20} className="text-gold-bright shrink-0 mt-0.5" />
                    <div>
                      <p className="font-tajawal text-gold-bright text-sm font-bold mb-1">
                        {t(
                          `باقي ${nextTier.min - ordersCount} طلب فقط!`,
                          `Just ${nextTier.min - ordersCount} orders left!`
                        )}
                      </p>
                      <p className="font-tajawal text-cream/70 text-xs">
                        {t(
                          `اطلب ${nextTier.min - ordersCount} طلبات إضافية واحصل على "${nextTier.ar}" مع خصم ${nextTier.discount}%`,
                          `Order ${nextTier.min - ordersCount} more to unlock "${nextTier.en}" with ${nextTier.discount}% discount`
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl p-4 border border-gold-bright bg-gold/10 text-center">
                  <p className="font-ruqaa text-lg text-gradient-gold">
                    🎉 {t('وصلت لأعلى مستوى!', 'You reached the top tier!')}
                  </p>
                  <p className="font-tajawal text-cream/70 text-xs mt-1">
                    {t(
                      `تستفيد الآن من خصم ${tier.discount}% دائم`,
                      `You now enjoy a permanent ${tier.discount}% discount`
                    )}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============ البطاقة الكاملة (ProfilePage) ============
export default function CustomerBadge({ ordersCount }: { ordersCount: number }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const tier = getCustomerTier(ordersCount);

  if (!tier) {
    return (
      <div className="rounded-2xl border border-gold/20 p-6 bg-emerald-deep/50 text-center">
        <Crown size={32} className="text-gold/50 mx-auto mb-3" />
        <p className="font-ruqaa text-xl text-cream/60 mb-2">
          {t('عضو جديد', 'New Member')}
        </p>
        <p className="font-tajawal text-cream/50 text-sm">
          {t(
            'اطلب 5 طلبات لتصبح عميل فضي وتحصل على خصم 10%',
            'Order 5 times to become Silver and get 10% off'
          )}
        </p>
      </div>
    );
  }

  const TierIcon = tier.icon;
  const nextTier = [...CUSTOMER_TIERS].reverse().find((t) => t.min > ordersCount);
  const progress = nextTier ? Math.min(100, (ordersCount / nextTier.min) * 100) : 100;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl border border-gold/20 p-6 bg-emerald-deep/50 hover:border-gold-bright transition-all text-right"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="flex items-center gap-2 text-cream font-tajawal">
            <TierIcon size={20} className="text-gold-bright" />
            {t(tier.ar, tier.en)}
          </span>
          <span className="text-xs text-cream/50 font-cairo">
            {ordersCount} {t('طلب', 'orders')}
          </span>
        </div>

        <div className="h-2 rounded-full bg-black-deep/50 overflow-hidden mb-2">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #C9A227, #F5D76E)',
            }}
          />
        </div>

        {nextTier ? (
          <p className="text-xs text-cream/45 font-tajawal">
            {nextTier.min - ordersCount}{' '}
            {t(
              `طلب متبقي للوصول لـ "${nextTier.ar}"`,
              `orders left to reach "${nextTier.en}"`
            )}
          </p>
        ) : (
          <p className="text-xs text-gold-bright font-tajawal">
            {t('وصلت لأعلى مستوى!', 'You reached the top tier!')}
          </p>
        )}
      </button>

      <CustomerModal
        open={open}
        onClose={() => setOpen(false)}
        ordersCount={ordersCount}
        tier={tier}
      />
    </>
  );
}