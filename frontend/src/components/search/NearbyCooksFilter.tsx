import { useState } from 'react';
import { LocateFixed, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export type Coords = { lat: number; lng: number };

// حساب المسافة بالكيلومتر بين نقطتين (صيغة Haversine)
export function distanceKm(a: Coords, b: Coords) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)) * 10) / 10;
}

interface NearbyCooksFilterProps {
  onLocate: (coords: Coords | null) => void;
}

export default function NearbyCooksFilter({ onLocate }: NearbyCooksFilterProps) {
  const { t } = useLanguage();
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
      setError(t('المتصفح لا يدعم تحديد الموقع', 'Browser does not support location'));
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
        setError(
          t(
            'تعذر الوصول لموقعك، تأكد من صلاحية الموقع',
            'Could not get your location'
          )
        );
      }
    );
  };

  return (
    <div className="inline-flex flex-col">
      <button
        onClick={toggle}
        className={
          'flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-tajawal border transition-colors ' +
          (active
            ? 'bg-gold text-emerald-deep border-gold font-bold'
            : 'border-gold/25 text-cream/70 hover:border-gold hover:text-gold-bright')
        }
      >
        {loading ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <LocateFixed size={15} />
        )}
        {t('الأقرب إليّ', 'Nearby')}
      </button>
      {error && <span className="text-[11px] text-red-400 mt-1">{error}</span>}
    </div>
  );
}