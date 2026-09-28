import { useState } from "react";
import { LocateFixed, Loader2 } from "lucide-react";

export type Coords = { lat: number; lng: number };

// حساب المسافة بالكيلومتر بين نقطتين (صيغة Haversine)
export function distanceKm(a: Coords, b: Coords) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)) * 10) / 10;
}

export default function NearbyCooksFilter({ onLocate }: { onLocate: (coords: Coords | null) => void }) {
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = () => {
    if (active) {
      setActive(false);
      onLocate(null);
      return;
    }
    if (!navigator.geolocation) {
      setError("المتصفح لا يدعم تحديد الموقع");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoading(false);
        setActive(true);
        onLocate({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setLoading(false);
        setError("تعذر الوصول لموقعك، تأكد من صلاحية الموقع بالمتصفح");
      }
    );
  };

  return (
    <div className="inline-flex flex-col">
      <button
        onClick={toggle}
        className={
          "flex items-center gap-2 rounded-full px-4 py-2.5 text-sm border transition-colors " +
          (active ? "bg-gold text-black-deep border-gold" : "border-gold/25 text-cream/70 hover:border-gold hover:text-gold")
        }
      >
        {loading ? <Loader2 size={15} className="animate-spin" /> : <LocateFixed size={15} />}
        الأقرب إليّ
      </button>
      {error && <span className="text-[11px] text-red-400 mt-1">{error}</span>}
    </div>
  );
}
