import { useState } from "react";
import toast from "react-hot-toast";
import SubscriptionCard, {
  PLANS,
} from "../components/Subscription/SubscriptionCard";
import SubscriptionModal from "../components/Subscription/SubscriptionModal";

export default function SubscriptionsPage() {
  const [selected, setSelected] = useState(null);
  const [active, setActive] = useState(null);

  const confirm = (choice) => {
    setActive({ ...choice, status: "active" });
    setSelected(null);
    toast.success(`تم تفعيل باقة ${choice.plan.name}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl text-cream mb-2 text-center">
        الاشتراكات الشهرية
      </h1>
      <p className="text-cream/50 mb-12 text-center">
        استلم وجباتك أسبوعياً بدون ما تفكر شتاكل
      </p>

      {active && (
        <div className="rounded-2xl border border-gold/25 p-6 mb-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-cream">
              اشتراكك الحالي:{" "}
              <span className="text-gold">{active.plan.name}</span>
            </p>
            <p className="text-xs text-cream/50 mt-1">
              {active.days.join("، ")} — {active.mealType}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setActive({
                  ...active,
                  status: active.status === "active" ? "paused" : "active",
                })
              }
              className="rounded-full border border-gold/40 text-gold px-4 py-2 text-sm"
            >
              {active.status === "active" ? "إيقاف مؤقت" : "استئناف"}
            </button>
            <button
              onClick={() => {
                setActive(null);
                toast.success("تم إلغاء الاشتراك");
              }}
              className="rounded-full border border-red-400/40 text-red-400 px-4 py-2 text-sm"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {PLANS.map((p) => (
          <SubscriptionCard key={p.key} plan={p} onSelect={setSelected} />
        ))}
      </div>

      {selected && (
        <SubscriptionModal
          plan={selected}
          onClose={() => setSelected(null)}
          onConfirm={confirm}
        />
      )}
    </div>
  );
}
