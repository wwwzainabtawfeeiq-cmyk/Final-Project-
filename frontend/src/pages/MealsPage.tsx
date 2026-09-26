import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { meals, categories } from '@/data/mockData';
import MealCard from '@/components/meals/MealCard';
import { cn } from '@/utils/cn';

export default function MealsPage() {
  const { t, lang } = useLanguage();
  const [params, setParams] = useSearchParams();
  const activeCategory = params.get('category') || 'all';
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return meals.filter(m => {
      const matchCat = activeCategory === 'all' || m.category === activeCategory;
      const matchSearch = !search ||
        (lang === 'ar' ? m.name : m.nameEn).toLowerCase().includes(search.toLowerCase()) ||
        (lang === 'ar' ? m.description : m.descriptionEn).toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, search, lang]);

  return (
    <div className="min-h-screen py-24 px-4 md:px-8 max-w-7xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-ruqaa text-5xl text-center text-gradient-gold mb-8"
      >
        {t('أطباقنا', 'Our Dishes')}
      </motion.h1>

      {/* بحث */}
      <div className="relative max-w-xl mx-auto mb-8">
        <Search size={20} className="absolute top-1/2 -translate-y-1/2 right-4 text-gold/50" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('ابحث عن طبق...', 'Search for a dish...')}
          className="w-full bg-emerald-deep/50 border border-gold/20 rounded-full py-3.5 pr-12 pl-4 text-cream font-tajawal focus:border-gold focus:outline-none focus:gold-glow transition-all"
        />
      </div>

      {/* فلتر الفئات */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setParams(cat.id === 'all' ? {} : { category: cat.id })}
            className={cn(
              'px-4 py-2 rounded-full font-tajawal text-sm transition-all',
              activeCategory === cat.id
                ? 'text-emerald-deep font-bold'
                : 'glass-light text-cream/70 hover:gold-glow'
            )}
            style={activeCategory === cat.id ? { background: 'linear-gradient(135deg, #C9A227, #F5D76E)' } : {}}
          >
            {lang === 'ar' ? cat.name : cat.nameEn}
          </button>
        ))}
      </div>

      {/* الشبكة */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-cream/50 font-tajawal text-xl">{t('لا توجد نتائج', 'No results found')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((meal, i) => (
            <MealCard key={meal.id} meal={meal} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
