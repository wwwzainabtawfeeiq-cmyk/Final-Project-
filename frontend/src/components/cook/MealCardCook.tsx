import { motion } from 'framer-motion';
import { Star, Edit, Trash2, Eye, EyeOff, Clock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/data/mockData';

interface MealCardCookProps {
  meal: {
    id: number;
    name: string;
    nameEn: string;
    price: number;
    image: string;
    rating: number;
    prepTime: string;
    category: string;
  };
  hidden?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleHide: () => void;
}

export default function MealCardCook({
  meal,
  hidden = false,
  onEdit,
  onDelete,
  onToggleHide,
}: MealCardCookProps) {
  const { t, lang } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, rgba(15, 36, 25, 0.9), rgba(27, 67, 50, 0.6))',
        border: '1px solid rgba(201, 162, 39, 0.2)',
        opacity: hidden ? 0.5 : 1,
      }}
    >
      {/* الصورة */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={meal.image}
          alt={meal.name}
          className="w-full h-full object-cover"
        />
        {hidden && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span
              className="px-4 py-2 rounded-full font-tajawal font-bold text-sm"
              style={{
                background: 'rgba(239, 68, 68, 0.9)',
                color: '#FFFFFF',
              }}
            >
              <EyeOff size={16} className="inline mr-1" />
              {t('مخفي', 'Hidden')}
            </span>
          </div>
        )}

        {/* التقييم */}
        <div
          className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full"
          style={{
            background: 'rgba(15, 36, 25, 0.9)',
            border: '1px solid rgba(201, 162, 39, 0.4)',
          }}
        >
          <Star size={12} fill="#F5D76E" color="#F5D76E" />
          <span className="font-cairo text-xs" style={{ color: '#F5D76E' }}>
            {meal.rating}
          </span>
        </div>
      </div>

      {/* المعلومات */}
      <div className="p-4">
        <h3
          className="font-tajawal font-bold text-base mb-1 truncate"
          style={{ color: '#FFFFFF' }}
        >
          {lang === 'ar' ? meal.name : meal.nameEn}
        </h3>

        <div className="flex items-center gap-3 mb-3">
          <span className="font-cairo text-lg text-gradient-gold">
            {formatPrice(meal.price)}
          </span>
          <span
            className="font-tajawal text-xs flex items-center gap-1"
            style={{ color: 'rgba(255, 255, 255, 0.5)' }}
          >
            <Clock size={12} /> {meal.prepTime}
          </span>
        </div>

        {/* الأزرار */}
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl font-tajawal text-xs font-bold transition-all"
            style={{
              border: '1px solid rgba(201, 162, 39, 0.4)',
              color: '#F5D76E',
            }}
          >
            <Edit size={14} /> {t('تعديل', 'Edit')}
          </button>
          <button
            onClick={onToggleHide}
            className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all"
            style={{
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            {hidden ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
          <button
            onClick={onDelete}
            className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all"
            style={{
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#f87171',
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}