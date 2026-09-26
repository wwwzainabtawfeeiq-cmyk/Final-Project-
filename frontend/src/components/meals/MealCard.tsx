import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Plus, Check, Flame, Clock, Heart } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { formatPrice, Meal } from '@/data/mockData';
import { cn } from '@/utils/cn';

export default function MealCard({ meal, index = 0 }: { meal: Meal; index?: number }) {
  const { t, lang } = useLanguage();
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [added, setAdded] = useState(false);
  const fav = isFavorite(meal.id);

  const handleAdd = () => {
    addItem(meal.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="group relative rounded-2xl overflow-hidden glass-light transition-all duration-500 hover:gold-glow"
    >
      {/* الصورة */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={meal.image}
          alt={lang === 'ar' ? meal.name : meal.nameEn}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep via-transparent to-transparent" />

        {/* شارة السعر */}
        <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-sm font-bold font-cairo"
          style={{ background: 'linear-gradient(135deg, #C9A227, #F5D76E)' }}>
          <span className="text-emerald-deep">{formatPrice(meal.price)}</span>
        </div>

        {/* زر المفضلة */}
        <button
          onClick={() => toggleFavorite(meal.id)}
          className="absolute top-3 left-3 w-9 h-9 rounded-full glass flex items-center justify-center hover:gold-glow transition-all"
        >
          <Heart size={16} className={cn(fav ? 'fill-gold text-gold' : 'text-cream/70')} />
        </button>

        {/* شارة حار */}
        {meal.spicy && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full glass text-xs font-tajawal">
            <Flame size={12} className="text-red-400" />
            <span className="text-cream">{t('حار', 'Spicy')}</span>
          </div>
        )}
      </div>

      {/* المحتوى */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-ruqaa text-xl text-cream group-hover:text-gold-bright transition-colors">
            {lang === 'ar' ? meal.name : meal.nameEn}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star size={14} className="fill-gold text-gold" />
            <span className="font-cairo text-sm text-gold-bright">{meal.rating}</span>
          </div>
        </div>

        <p className="text-cream/60 text-sm font-tajawal leading-relaxed mb-3 line-clamp-2">
          {lang === 'ar' ? meal.description : meal.descriptionEn}
        </p>

        <div className="flex items-center gap-2 mb-3 text-cream/50 text-xs font-tajawal">
          <Clock size={14} className="text-gold" />
          {meal.prepTime}
        </div>

        {/* زر الإضافة */}
        <motion.button
          onClick={handleAdd}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'w-full py-2.5 rounded-xl font-tajawal font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden',
            added ? 'bg-green-600 text-cream' : ''
          )}
          style={!added ? { background: 'linear-gradient(135deg, #C9A227, #F5D76E)' } : {}}
        >
          {added ? (
            <>
              <Check size={18} />
              {t('تمت الإضافة', 'Added')}
            </>
          ) : (
            <>
              <Plus size={18} className={t('', '')} />
              <span className="text-emerald-deep">{t('أضف للسلة', 'Add to Cart')}</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
