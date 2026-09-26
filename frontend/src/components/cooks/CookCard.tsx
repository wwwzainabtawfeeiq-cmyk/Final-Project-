import { motion } from 'framer-motion';
import { Star, Award, ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Cook } from '@/data/mockData';

export default function CookCard({ cook, index = 0 }: { cook: Cook; index?: number }) {
  const { t, lang } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="group relative rounded-2xl overflow-hidden glass-light p-6 text-center transition-all duration-500 hover:gold-glow"
    >
      {/* شارة الأكثر طلباً */}
      {cook.topRated && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-tajawal font-bold"
          style={{ background: 'linear-gradient(135deg, #C9A227, #F5D76E)' }}>
          <Award size={12} className="text-emerald-deep" />
          <span className="text-emerald-deep">{t('الأكثر طلباً', 'Top Rated')}</span>
        </div>
      )}

      {/* صورة دائرية */}
      <div className="relative w-28 h-28 mx-auto mb-4">
        <div className="absolute inset-0 rounded-full gold-glow-strong transition-all duration-500 group-hover:gold-glow" />
        <div className="absolute inset-0 rounded-full" style={{ border: '3px solid transparent', background: 'linear-gradient(#0F2419, #0F2419) padding-box, linear-gradient(135deg, #C9A227, #F5D76E, #C9A227) border-box' }}>
          <img src={cook.image} alt={lang === 'ar' ? cook.name : cook.nameEn}
            className="w-full h-full rounded-full object-cover" loading="lazy" />
        </div>
      </div>

      <h3 className="font-ruqaa text-2xl text-cream mb-1">{lang === 'ar' ? cook.name : cook.nameEn}</h3>
      <p className="text-gold-bright font-tajawal text-sm mb-2">{lang === 'ar' ? cook.specialty : cook.specialtyEn}</p>
      <p className="text-cream/50 text-xs font-tajawal mb-4">{lang === 'ar' ? cook.bio : cook.bioEn}</p>

      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-1">
          <Star size={16} className="fill-gold text-gold" />
          <span className="font-cairo text-sm text-gold-bright">{cook.rating}</span>
        </div>
        <div className="w-px h-4 bg-gold/20" />
        <div className="flex items-center gap-1">
          <ShoppingBag size={16} className="text-gold" />
          <span className="font-cairo text-sm text-cream/70">{cook.orders} {t('طلب', 'orders')}</span>
        </div>
      </div>
    </motion.div>
  );
}
