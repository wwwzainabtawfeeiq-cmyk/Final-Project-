import { motion } from 'framer-motion';
import { UtensilsCrossed, ChefHat, Flame, CookingPot, Salad, Cake, Wheat, Soup } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { categories } from '@/data/mockData';
import { cn } from '@/utils/cn';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  UtensilsCrossed, ChefHat, Flame, CookingPot, Salad, Cake, Wheat, Soup,
};

export default function CategoryFilter({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  const { t, lang } = useLanguage();

  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-ruqaa text-4xl text-center text-gradient-gold mb-10"
      >
        {t('تصفح حسب الفئة', 'Browse by Category')}
      </motion.h2>

      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
        {categories.map((cat, i) => {
          const Icon = iconMap[cat.icon] || UtensilsCrossed;
          const isActive = active === cat.id;
          return (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(cat.id)}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 min-w-[100px]',
                isActive ? 'gold-glow' : 'glass-light hover:gold-glow'
              )}
              style={isActive ? { background: 'linear-gradient(135deg, #C9A227, #F5D76E)' } : {}}
            >
              <div className={cn('w-14 h-14 rounded-full flex items-center justify-center', isActive ? 'bg-emerald-deep' : 'glass')}>
                <Icon size={24} className={isActive ? 'text-gold-bright' : 'text-gold'} />
              </div>
              <span className={cn('font-tajawal text-sm', isActive ? 'text-emerald-deep font-bold' : 'text-cream/80')}>
                {lang === 'ar' ? cat.name : cat.nameEn}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
