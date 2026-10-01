import { useState } from "react";
import { X } from "lucide-react";

const DAYS = [
  "السبت",
  "الأحد",
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
];
const MEAL_TYPES = ["رئيسية", "مشاوي", "شوربات", "متنوع"];

export default function SubscriptionModal({ plan, onClose, onConfirm }) {
  const [days, setDays] = useState([]);
  const [mealType, setMealType] = useState(MEAL_TYPES[0]);

  const toggleDay = (d) =>
    setDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
    );

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black-deep/70 backdrop-blur-sm px-6">
      <div className="glass rounded-3xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-2xl text-cream">
            تخصيص باقة {plan.name}
          </h2>
          <button
            onClick={onClose}
            className="text-cream/60 hover:text-gold"
            aria-label="إغلاق"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-cream/60 mb-2">أيام التوصيل</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {DAYS.map((d) => (
            <button
              key={d}
              onClick={() => toggleDay(d)}
              className={
                "text-xs rounded-full px-3 py-1.5 border transition-colors " +
                (days.includes(d)
                  ? "bg-gold text-black-deep border-gold"
                  : "border-gold/25 text-cream/60")
              }
            >
              {d}
            </button>
          ))}
        </div>

        <p className="text-sm text-cream/60 mb-2">نوع الوجبات</p>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {MEAL_TYPES.map((m) => (
            <button
              key={m}
              onClick={() => setMealType(m)}
              className={
                "rounded-xl py-2.5 text-sm border " +
                (mealType === m
                  ? "bg-gold/15 border-gold text-gold"
                  : "border-gold/15 text-cream/60")
              }
            >
              {m}
            </button>
          ))}
        </div>

        <button
          disabled={!days.length}
          onClick={() => onConfirm({ plan, days, mealType })}
          className="w-full rounded-full bg-gradient-to-l from-gold to-gold-light text-black-deep py-3 font-medium disabled:opacity-40"
        >
          تأكيد الاشتراك
        </button>
      </div>
    </div>
  );
}
