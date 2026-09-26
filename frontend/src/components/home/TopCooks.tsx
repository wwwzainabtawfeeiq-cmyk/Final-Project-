import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cooks } from '@/data/mockData';
import CookCard from '@/components/cooks/CookCard';

export default function TopCooks() {
  const { t, lang } = useLanguage();
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="font-ruqaa text-4xl text-gradient-gold"
          >
            {t('نخبة الطُهاة', 'Top Cooks')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-cream/60 font-tajawal mt-2"
          >
            {t('طُهاة منزليون موثوقون بخبرة سنوات', 'Trusted home cooks with years of experience')}
          </motion.p>
        </div>
        <Link to="/cooks" className="hidden md:flex items-center gap-2 text-gold-bright font-tajawal hover:gap-3 transition-all">
          {t('عرض الكل', 'View All')}
          <Arrow size={18} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cooks.slice(0, 4).map((cook, i) => (
          <CookCard key={cook.id} cook={cook} index={i} />
        ))}
      </div>
    </section>
  );
}
