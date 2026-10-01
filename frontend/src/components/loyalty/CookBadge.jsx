import { useState } from "react";
import { X, TrendingUp, Award, Flame, ChefHat, Crown, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const COOK_TIERS = [
  {
    min: 100,
    ar: "طاهٍ بلاتيني",
    en: "Platinum Chef",
    commission: 8,
    badge: "💎",
    icon: Crown,
    color: "from-[#E5E4E2] to-[#C9A227]",
    perks: {
      ar: [
        "عمولة 8% فقط",
        "ظهور في الصفحة الرئيسية",
        "دعم تسويقي كامل",
        "أولوية في التوصيل",
        "شارة VIP ذهبية",
      ],
      en: [
        "Only 8% commission",
        "Featured on homepage",
        "Full marketing support",
        "Priority delivery",
        "Gold VIP badge",
      ],
    },
  },
  {
    min: 50,
    ar: "طاهٍ ذهبي",
    en: "Gold Chef",
    commission: 10,
    badge: "🥇",
    icon: Award,
    color: "from-[#C9A227] to-[#F5D76E]",
    perks: {
      ar: [
        "عمولة 10%",
        "أولوية في نتائج البحث",
        "إحصائيات متقدمة",
        "شارة ذهبية على البروفايل",
      ],
      en: [
        "10% commission",
        "Priority in search results",
        "Advanced analytics",
        "Gold badge on profile",
      ],
    },
  },
  {
    min: 20,
    ar: "طاهٍ محترف",
    en: "Professional Chef",
    commission: 12,
    badge: "🥈",
    icon: Flame,
    color: "from-[#B8B8B8] to-[#E5E4E2]",
    perks: {
      ar: ["عمولة 12%", "إحصائيات أساسية", "أولوية في الدعم"],
      en: ["12% commission", "Basic analytics", "Priority support"],
    },
  },
  {
    min: 5,
    ar: "طاهٍ مبتدئ",
    en: "Rising Chef",
    commission: 15,
    badge: "🥉",
    icon: ChefHat,
    color: "from-[#8B6914] to-[#C9A227]",
    perks: {
      ar: ["عمولة 15%", "إحصائيات الطلبات الأساسية", "دعم فني"],
      en: ["15% commission", "Basic order stats", "Technical support"],
    },
  },
];

function getCookTier(ordersCount) {
  return (
    COOK_TIERS.find((t) => ordersCount >= t.min) ||
    COOK_TIERS[COOK_TIERS.length - 1]
  );
}

// ============ الشارة المصغرة (Navbar) ============
export function CookBadgeCompact({ ordersCount }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const tier = getCookTier(ordersCount);
  const TierIcon = tier.icon;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden sm:flex items-center gap-1.5 rounded-full border border-gold/40 text-gold-bright text-[11px] px-3 py-1.5 font-tajawal hover:bg-gold/15 hover:border-gold-bright transition-all cursor-pointer"
      >
        <TierIcon size={12} />
        {t(tier.ar, tier.en)}
      </button>

      <CookModal
        open={open}
        onClose={() => setOpen(false)}
        ordersCount={ordersCount}
        tier={tier}
      />
    </>
  );
}

// ============ النافذة المنبثقة ============
function CookModal({ open, onClose, ordersCount, tier }) {
  const { t } = useLanguage();
  const nextTier = [...COOK_TIERS].reverse().find((t) => t.min > ordersCount);
  const progress = nextTier
    ? Math.min(100, (ordersCount / nextTier.min) * 100)
    : 100;
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
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 22, stiffness: 250 }}
            className="relative w-full max-w-md rounded-3xl overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #0F2419 0%, #1B4332 50%, #0F2419 100%)",
              border: "2px solid rgba(201, 162, 39, 0.4)",
              boxShadow: "0 25px 80px rgba(201, 162, 39, 0.4)",
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
                background:
                  "radial-gradient(circle at 50% 0%, rgba(201,162,39,0.4), transparent 70%)",
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

                <div className="text-5xl mb-2">{tier.badge}</div>

                <h2 className="font-ruqaa text-3xl text-gradient-gold mb-1">
                  {t(tier.ar, tier.en)}
                </h2>
                <p className="font-tajawal text-cream/60 text-sm">
                  {ordersCount} {t("طلب منجز", "completed orders")}
                </p>

                <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-gold/10 border border-gold/30">
                  <Zap size={14} className="text-gold-bright" />
                  <span className="font-tajawal text-gold-bright text-sm font-bold">
                    {t("عمولة", "Commission")}: {tier.commission}%
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-xs font-tajawal text-cream/60 mb-2">
                  <span>{t("المستوى الحالي", "Current tier")}</span>
                  {nextTier && (
                    <span className="text-gold-bright">
                      {nextTier.min - ordersCount}{" "}
                      {t("طلب للمستوى التالي", "orders to next tier")}
                    </span>
                  )}
                </div>
                <div className="h-3 rounded-full bg-black-deep/60 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full"
                    style={{
                      background: "linear-gradient(90deg, #C9A227, #F5D76E)",
                    }}
                  />
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Award size={16} className="text-gold-bright" />
                  <h3 className="font-tajawal font-bold text-cream text-sm">
                    {t("مزاياك كطاهٍ", "Your chef perks")}
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
                    <TrendingUp
                      size={20}
                      className="text-gold-bright shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="font-tajawal text-gold-bright text-sm font-bold mb-1">
                        {t(
                          `أنجز ${nextTier.min - ordersCount} طلب للترقية!`,
                          `Complete ${nextTier.min - ordersCount} orders to level up!`,
                        )}
                      </p>
                      <p className="font-tajawal text-cream/70 text-xs">
                        {t(
                          `ستحصل على "${nextTier.ar}" مع عمولة ${nextTier.commission}% فقط`,
                          `You'll get "${nextTier.en}" with just ${nextTier.commission}% commission`,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl p-4 border border-gold-bright bg-gold/10 text-center">
                  <p className="font-ruqaa text-lg text-gradient-gold">
                    💎 {t("أنت في القمة!", "You are at the top!")}
                  </p>
                  <p className="font-tajawal text-cream/70 text-xs mt-1">
                    {t(
                      `عمولتك ${tier.commission}% فقط — الأقل في المنصة`,
                      `Your commission is just ${tier.commission}% — the lowest on the platform`,
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

// ============ البطاقة الكاملة (CookDashboard) ============
export default function CookBadge({ ordersCount }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const tier = getCookTier(ordersCount);
  const TierIcon = tier.icon;
  const nextTier = [...COOK_TIERS].reverse().find((t) => t.min > ordersCount);
  const progress = nextTier
    ? Math.min(100, (ordersCount / nextTier.min) * 100)
    : 100;

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
            {ordersCount} {t("طلب", "orders")}
          </span>
        </div>

        <div className="flex items-center justify-between mb-2">
          <span className="font-tajawal text-xs text-cream/60">
            {t("العمولة الحالية", "Current commission")}
          </span>
          <span className="font-cairo text-gold-bright font-bold text-sm">
            {tier.commission}%
          </span>
        </div>

        <div className="h-2 rounded-full bg-black-deep/50 overflow-hidden mb-2">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #C9A227, #F5D76E)",
            }}
          />
        </div>

        {nextTier ? (
          <p className="text-xs text-cream/45 font-tajawal">
            {nextTier.min - ordersCount}{" "}
            {t(
              `طلب للترقية وعمولة ${nextTier.commission}%`,
              `orders to level up`,
            )}
          </p>
        ) : (
          <p className="text-xs text-gold-bright font-tajawal">
            {t("وصلت لأعلى مستوى!", "You reached the top tier!")}
          </p>
        )}
      </button>

      <CookModal
        open={open}
        onClose={() => setOpen(false)}
        ordersCount={ordersCount}
        tier={tier}
      />
    </>
  );
}
