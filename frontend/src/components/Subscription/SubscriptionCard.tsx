import { Check } from "lucide-react";

export type Plan = {
  key: "basic" | "family" | "premium";
  name: string;
  mealsPerWeek: number;
  price: number;
  perks: string[];
};

export const PLANS: Plan[] = [
  { key: "basic", name: "أساسية", mealsPerWeek: 5, price: 55000, perks: ["5 وجبات أسبوعياً", "توصيل مجاني"] },
  { key: "family", name: "عائلية", mealsPerWeek: 10, price: 100000, perks: ["10 وجبات أسبوعياً", "توصيل مجاني", "خصم 10% على الحلويات"] },
  { key: "premium", name: "فاخرة", mealsPerWeek: 15, price: 140000, perks: ["15 وجبة أسبوعياً", "أولوية بالتوصيل", "اختيار الطباخ المفضل"] },
];

export default function SubscriptionCard({ plan, onSelect }: { plan: Plan; onSelect: (plan: Plan) => void }) {
  return (
    <div className="gold-border-gradient rounded-3xl bg-gradient-to-b from-green-deep/25 to-black-deep/40 p-8 text-center hover:shadow-gold transition-shadow">
      <h3 className="font-display text-2xl text-gold">{plan.name}</h3>
      <p className="text-cream/50 mt-1">{plan.mealsPerWeek} وجبة أسبوعياً</p>
      <p className="font-display text-3xl text-cream mt-5">{plan.price.toLocaleString("ar-IQ")} د.ع<span className="text-xs text-cream/40">/شهرياً</span></p>
      <ul className="mt-6 space-y-2 text-sm text-cream/60 text-right">
        {plan.perks.map((p) => (
          <li key={p} className="flex items-center gap-2"><Check size={14} className="text-gold shrink-0" /> {p}</li>
        ))}
      </ul>
      <button onClick={() => onSelect(plan)} className="btn-shine mt-8 w-full rounded-full bg-gradient-to-l from-gold to-gold-light text-black-deep py-3 font-medium">
        اشترك الآن
      </button>
    </div>
  );
}
