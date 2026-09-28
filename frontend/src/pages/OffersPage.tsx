import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Offer = {
  id: string;
  title: string;
  discountPercent: number;
  image?: string;
  endsAt: string; // ISO date
  mealsCategory?: string;
};

const OFFERS: Offer[] = [
  { id: "national-day", title: "خصم اليوم الوطني", discountPercent: 20, endsAt: "2026-10-03T23:59:59", mealsCategory: "main" },
  { id: "weekly", title: "عرض نهاية الأسبوع", discountPercent: 10, endsAt: "2026-10-01T23:59:59", mealsCategory: "grill" },
  { id: "eid", title: "عرض الأعياد", discountPercent: 15, endsAt: "2026-11-15T23:59:59", mealsCategory: "sweet" },
];

function useCountdown(target: string) {
  const [left, setLeft] = useState(() => new Date(target).getTime() - Date.now());
  useEffect(() => {
    const id = setInterval(() => setLeft(new Date(target).getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  if (left <= 0) return null;
  const d = Math.floor(left / 86400000);
  const h = Math.floor((left % 86400000) / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);
  return { d, h, m, s };
}

function OfferCard({ offer }: { offer: Offer }) {
  const t = useCountdown(offer.endsAt);
  return (
    <div className="gold-border-gradient rounded-2xl overflow-hidden bg-gradient-to-b from-green-deep/25 to-black-deep/40">
      <div className="aspect-[16/9] bg-green-deep/30 grid place-items-center relative">
        {offer.image ? (
          <img src={offer.image} alt={offer.title} className="h-full w-full object-cover" />
        ) : (
          <span className="font-display text-4xl text-gold/30">%{offer.discountPercent}</span>
        )}
        <span className="absolute top-3 right-3 rounded-full bg-gold text-black-deep text-xs font-bold px-3 py-1">
          خصم {offer.discountPercent}%
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl text-cream">{offer.title}</h3>
        {t ? (
          <div className="flex gap-3 mt-3 text-center">
            {[["يوم", t.d], ["ساعة", t.h], ["دقيقة", t.m], ["ثانية", t.s]].map(([label, val]) => (
              <div key={label as string} className="flex-1 rounded-lg bg-black-deep/40 border border-gold/15 py-2">
                <p className="font-display text-gold text-lg">{val}</p>
                <p className="text-[10px] text-cream/45">{label}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-cream/40 text-sm mt-3">انتهى هذا العرض</p>
        )}
        <Link
          to={`/meals${offer.mealsCategory ? `?category=${offer.mealsCategory}` : ""}`}
          className="btn-shine block text-center mt-5 rounded-full bg-gradient-to-l from-gold to-gold-light text-black-deep py-2.5 font-medium"
        >
          استفد من العرض
        </Link>
      </div>
    </div>
  );
}

export default function OffersPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl text-cream mb-2">العروض والإعلانات</h1>
      <p className="text-cream/50 mb-10">عروض محدودة بمناسبات ومواسم مختلفة</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {OFFERS.map((o) => <OfferCard key={o.id} offer={o} />)}
      </div>
    </div>
  );
}
