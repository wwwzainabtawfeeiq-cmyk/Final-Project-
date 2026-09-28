import { Crown } from "lucide-react";

const TIERS = [
  { min: 20, label: "عميل بلاتيني", discount: 20 },
  { min: 10, label: "عميل ذهبي", discount: 15 },
  { min: 5, label: "عميل فضي", discount: 10 },
];

function getTier(ordersCount: number) {
  return TIERS.find((t) => ordersCount >= t.min) || null;
}

// شارة مصغرة تُستخدم بالـ Navbar
export function LoyaltyBadgeCompact({ ordersCount }: { ordersCount: number }) {
  const tier = getTier(ordersCount);
  if (!tier) return null;
  return (
    <span className="hidden sm:flex items-center gap-1 rounded-full border border-gold/40 text-gold text-[11px] px-2.5 py-1">
      <Crown size={12} /> {tier.label}
    </span>
  );
}

// بطاقة كاملة بشريط تقدم تُستخدم بصفحة البروفايل
export default function LoyaltyBadge({ ordersCount }: { ordersCount: number }) {
  const tier = getTier(ordersCount);
  const nextTier = [...TIERS].reverse().find((t) => t.min > ordersCount);
  const progress = nextTier ? Math.min(100, (ordersCount / nextTier.min) * 100) : 100;

  return (
    <div className="rounded-2xl border border-gold/20 p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="flex items-center gap-2 text-cream">
          <Crown size={18} className="text-gold" /> {tier ? tier.label : "عضو جديد"}
        </span>
        <span className="text-xs text-cream/50">{ordersCount} طلب</span>
      </div>
      <div className="h-2 rounded-full bg-black-deep/50 overflow-hidden">
        <div className="h-full bg-gradient-to-l from-gold to-gold-light transition-all" style={{ width: `${progress}%` }} />
      </div>
      {nextTier ? (
        <p className="text-xs text-cream/45 mt-2">
          {nextTier.min - ordersCount} طلب متبقي للوصول لـ "{nextTier.label}" وخصم {nextTier.discount}%
        </p>
      ) : (
        <p className="text-xs text-gold mt-2">وصلت لأعلى مستوى! تستفيد الآن من خصم {tier?.discount}% دائم</p>
      )}
    </div>
  );
}
