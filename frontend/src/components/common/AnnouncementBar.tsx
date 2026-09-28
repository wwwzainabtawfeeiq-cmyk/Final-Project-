import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const STORAGE_KEY = "bf_announcement_dismissed_v1";
const MESSAGE = "🎉 خصم 20% بمناسبة اليوم الوطني! اطلب الآن قبل انتهاء العرض";

// شريط إعلان متحرك يظهر فقط عند وجود عروض نشطة، ويحفظ حالة الإغلاق
export default function AnnouncementBar({ hasActiveOffers = true }: { hasActiveOffers?: boolean }) {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  if (!hasActiveOffers || dismissed) return null;

  const close = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.setItem(STORAGE_KEY, "1");
    setDismissed(true);
  };

  return (
    <div
      onClick={() => navigate("/offers")}
      className="relative z-[55] overflow-hidden bg-gradient-to-l from-gold to-gold-light text-black-deep cursor-pointer"
    >
      <div className="flex items-center py-2 whitespace-nowrap animate-[marquee_18s_linear_infinite]">
        <span className="mx-6 text-sm font-medium">{MESSAGE}</span>
        <span className="mx-6 text-sm font-medium">{MESSAGE}</span>
        <span className="mx-6 text-sm font-medium">{MESSAGE}</span>
      </div>
      <button
        onClick={close}
        aria-label="إغلاق الإعلان"
        className="absolute left-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-black-deep/15 hover:bg-black-deep/30 grid place-items-center"
      >
        <X size={13} />
      </button>
      <style>{`@keyframes marquee { from { transform: translateX(100%); } to { transform: translateX(-100%); } }`}</style>
    </div>
  );
}
