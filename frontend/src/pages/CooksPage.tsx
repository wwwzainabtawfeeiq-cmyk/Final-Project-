import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { cooks } from '@/data/mockData';
import CookCard from '@/components/cooks/CookCard';

export default function CooksPage() {
  const { t } = useLanguage();

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
        className="text-cream/60 font-tajawal text-center mb-12 max-w-2xl mx-auto"
      >
        {t('طُهاة منزليون موثوقون، كل منهم يحمل خبرة سنوات ووصفات توارثوها عن الجدات', 'Trusted home cooks, each with years of experience and recipes inherited from grandmothers')}
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cooks.map((cook, i) => (
          <CookCard key={cook.id} cook={cook} index={i} />
        ))}
      </div>
    </div>
  );
}
