import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useFavorites } from '@/context/FavoritesContext';
import { meals } from '@/data/mockData';
import MealCard from '@/components/meals/MealCard';

export default function FavoritesPage() {
  const { t } = useLanguage();
  const { favorites } = useFavorites();
  const favMeals = meals.filter(m => favorites.includes(m.id));

  return (
    <div className="min-h-screen py-24 px-4 md:px-8 max-w-7xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-ruqaa text-5xl text-center text-gradient-gold mb-12"
      >
        {t('المفضلة', 'Favorites')}
      </motion.h1>

      {favMeals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-6">
          <div className="w-24 h-24 rounded-full glass-light flex items-center justify-center">
            <Heart size={40} className="text-gold/40" />
          </div>
          <p className="text-cream/50 font-tajawal text-xl">{t('لا توجد أطباق مفضلة بعد', 'No favorite dishes yet')}</p>
          <Link to="/meals" className="px-6 py-3 rounded-full font-tajawal font-bold relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #C9A227, #F5D76E)' }}>
            <span className="relative z-10 text-emerald-deep">{t('تصفح الأطباق', 'Browse Meals')}</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favMeals.map((meal, i) => (
            <MealCard key={meal.id} meal={meal} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
