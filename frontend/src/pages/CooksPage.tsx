import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { cooks } from '@/data/mockData';
import CookCard from '@/components/cooks/CookCard';
import NearbyCooksFilter, { distanceKm, type Coords } from '@/components/search/NearbyCooksFilter';

// إحداثيات تقريبية لكل طباخ (للعرض)
const COOK_COORDS: Record<number, Coords> = {
  1: { lat: 30.5085, lng: 47.7804 }, // العشار
  2: { lat: 30.3947, lng: 47.7079 }, // الزبير
  3: { lat: 30.5249, lng: 47.8025 }, // الجبيلة
  4: { lat: 30.4866, lng: 47.7885 }, // البراضعية
  5: { lat: 30.5519, lng: 47.7620 }, // الجزائر
  6: { lat: 30.4774, lng: 47.8281 }, // خمسة ميل
};

export default function CooksPage() {
  const { t } = useLanguage();
  const [userCoords, setUserCoords] = useState<Coords | null>(null);

  // ترتيب الطهاة حسب القرب إذا كان الموقع متاحًا
  const sortedCooks = useMemo(() => {
    if (!userCoords) return cooks;
    return [...cooks].sort((a, b) => {
      const aCoords = COOK_COORDS[a.id];
      const bCoords = COOK_COORDS[b.id];
      if (!aCoords || !bCoords) return 0;
      return distanceKm(userCoords, aCoords) - distanceKm(userCoords, bCoords);
    });
  }, [userCoords]);

  return (
    <div className="min-h-screen py-24 px-4 md:px-8 max-w-7xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-ruqaa text-5xl text-center text-gradient-gold mb-4"
      >
        {t('طُهاة نكهة البصرة', 'Basra Flavor Cooks')}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-cream/60 font-tajawal text-center mb-8 max-w-2xl mx-auto"
      >
        {t(
          'طُهاة منزليون موثوقون، كل منهم يحمل خبرة سنوات ووصفات توارثوها عن الجدات',
          'Trusted home cooks with years of experience and inherited recipes'
        )}
      </motion.p>

      {/* فلتر "الأقرب إليّ" */}
      <div className="flex justify-center mb-10">
        <NearbyCooksFilter onLocate={setUserCoords} />
      </div>

      {/* رسالة عند تفعيل الموقع */}
      {userCoords && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-gold-bright font-tajawal text-sm mb-6"
        >
          ✨ {t('مرتبة حسب الأقرب إليك', 'Sorted by nearest to you')}
        </motion.p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCooks.map((cook, i) => {
          const coords = COOK_COORDS[cook.id];
          const distance = userCoords && coords ? distanceKm(userCoords, coords) : null;

          return (
            <div key={cook.id} className="relative">
              <CookCard cook={cook} index={i} />

              {/* المسافة */}
              {distance !== null && (
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-cairo font-bold text-emerald-deep z-10"
                  style={{ background: 'linear-gradient(135deg, #C9A227, #F5D76E)' }}
                >
                  📍 {distance} {t('كم', 'km')}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}