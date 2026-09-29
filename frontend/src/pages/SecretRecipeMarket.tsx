import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Search,
  MapPin,
  Star,
  Lock,
  ShoppingBag,
  ChefHat,
  DollarSign,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/data/mockData';

interface Recipe {
  id: number;
  title: { ar: string; en: string };
  cook: string;
  image: string;
  area: string;
  price: number;
  rating: number;
  buyers: number;
  secret: { ar: string; en: string };
  category: string;
}

const MOCK_RECIPES: Recipe[] = [
  {
    id: 1,
    title: { ar: 'سر المسكوف الأصلي', en: 'Authentic Masgouf Secret' },
    cook: 'أم أحمد',
    image: 'https://images.pexels.com/photos/36796430/pexels-photo-36796430.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    area: 'العشار',
    price: 50000,
    rating: 4.9,
    buyers: 45,
    secret: { ar: 'خلطة البهارات السرية', en: 'Secret spice mix' },
    category: 'مشاوي',
  },
  {
    id: 2,
    title: { ar: 'طريقة البرياني الأصلي', en: 'Authentic Biryani Method' },
    cook: 'أبو كرار',
    image: 'https://images.pexels.com/photos/32986475/pexels-photo-32986475.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    area: 'خمسة ميل',
    price: 35000,
    rating: 4.8,
    buyers: 78,
    secret: { ar: 'طريقة طهي الأرز', en: 'Rice cooking method' },
    category: 'أرز',
  },
  {
    id: 3,
    title: { ar: 'سر الزلابية المقرمشة', en: 'Crispy Zalabia Secret' },
    cook: 'ست نورية',
    image: 'https://images.pexels.com/photos/31786489/pexels-photo-31786489.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    area: 'الجبيلة',
    price: 25000,
    rating: 5.0,
    buyers: 120,
    secret: { ar: 'خلطة العجين', en: 'Dough mix' },
    category: 'حلويات',
  },
  {
    id: 4,
    title: { ar: 'سر التشريب البصري', en: 'Basra Tashreeb Secret' },
    cook: 'أم سيف',
    image: 'https://images.pexels.com/photos/38301350/pexels-photo-38301350.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    area: 'الجزائر',
    price: 30000,
    rating: 4.7,
    buyers: 56,
    secret: { ar: 'طريقة المرق', en: 'Broth method' },
    category: 'أطباق رئيسية',
  },
  {
    id: 5,
    title: { ar: 'سر الكباب البصري', en: 'Basra Kebab Secret' },
    cook: 'أبو حسين',
    image: 'https://images.pexels.com/photos/32986489/pexels-photo-32986489.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    area: 'الزبير',
    price: 40000,
    rating: 4.8,
    buyers: 92,
    secret: { ar: 'خلطة اللحم', en: 'Meat mix' },
    category: 'مشاوي',
  },
];

export default function SecretRecipeMarket() {
  const { t, lang } = useLanguage();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(MOCK_RECIPES.map((r) => r.category)))];

  const filteredRecipes = MOCK_RECIPES.filter((recipe) => {
    const matchSearch =
      recipe.title.ar.includes(search) ||
      recipe.title.en.toLowerCase().includes(search.toLowerCase()) ||
      recipe.cook.includes(search);
    const matchCategory = category === 'all' || recipe.category === category;
    return matchSearch && matchCategory;
  });

  const handleBuy = (recipe: Recipe) => {
    toast.success(
      t(
        `تم شراء "${recipe.title.ar}" بنجاح!`,
        `"${recipe.title.en}" purchased successfully!`
      )
    );
  };

  return (
    <div className="min-h-screen py-24 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
          style={{ background: 'linear-gradient(135deg, #8B6914, #C9A227)' }}
        >
          <BookOpen size={40} style={{ color: '#FFFFFF' }} />
        </div>
        <h1 className="font-ruqaa text-5xl text-gradient-gold text-glow-gold mb-3">
          {t('سوق الوصفات السرية', 'Secret Recipe Market')}
        </h1>
        <p
          className="font-tajawal text-lg max-w-2xl mx-auto"
          style={{ color: 'rgba(255, 255, 255, 0.6)' }}
        >
          {t(
            'اشترِ أسرار الطُهاة المحترفين — وصفات حصرية لا تجدها في أي مكان آخر',
            'Buy secrets from professional chefs — exclusive recipes you won\'t find anywhere else'
          )}
        </p>
      </motion.div>

      {/* البحث + الفئات */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="relative flex-1 max-w-xs">
          <Search
            size={18}
            className="absolute top-1/2 -translate-y-1/2 right-3"
            style={{ color: 'rgba(201, 162, 39, 0.6)' }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('ابحث عن وصفة...', 'Search recipe...')}
            className="w-full rounded-xl py-2.5 pr-11 pl-4 font-tajawal text-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="px-4 py-2 rounded-full font-tajawal text-xs font-bold whitespace-nowrap transition-all"
              style={{
                background:
                  category === cat
                    ? 'linear-gradient(135deg, #C9A227, #F5D76E)'
                    : 'rgba(255, 255, 255, 0.08)',
                color: category === cat ? '#0F2419' : 'rgba(255, 255, 255, 0.7)',
                border:
                  category === cat ? 'none' : '1px solid rgba(201, 162, 39, 0.25)',
              }}
            >
              {cat === 'all' ? t('الكل', 'All') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* الشبكة */}
      {filteredRecipes.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen size={48} className="mx-auto mb-4" style={{ color: 'rgba(201, 162, 39, 0.3)' }} />
          <p className="font-tajawal text-lg" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            {t('لا توجد وصفات', 'No recipes')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecipes.map((recipe, i) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-3xl overflow-hidden group"
              style={{
                background:
                  'linear-gradient(135deg, rgba(15, 36, 25, 0.9), rgba(27, 67, 50, 0.6))',
                border: '1px solid rgba(201, 162, 39, 0.2)',
              }}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={recipe.image}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep via-transparent to-transparent" />

                {/* Badge التقييم */}
                <div
                  className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full"
                  style={{
                    background: 'rgba(15, 36, 25, 0.9)',
                    border: '1px solid rgba(201, 162, 39, 0.4)',
                  }}
                >
                  <Star size={12} fill="#F5D76E" color="#F5D76E" />
                  <span className="font-cairo text-xs" style={{ color: '#F5D76E' }}>
                    {recipe.rating}
                  </span>
                </div>

                {/* Badge القفل */}
                <div
                  className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full"
                  style={{
                    background: 'rgba(201, 162, 39, 0.9)',
                    color: '#0F2419',
                  }}
                >
                  <Lock size={12} />
                  <span className="font-tajawal text-[10px] font-bold">
                    {t('حصري', 'Exclusive')}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-ruqaa text-xl text-gradient-gold mb-3">
                  {lang === 'ar' ? recipe.title.ar : recipe.title.en}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 font-tajawal text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <ChefHat size={12} style={{ color: '#F5D76E' }} /> {recipe.cook}
                  </div>
                  <div className="flex items-center gap-2 font-tajawal text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <MapPin size={12} style={{ color: '#F5D76E' }} /> {recipe.area}
                  </div>
                </div>

                {/* السر */}
                <div
                  className="p-3 rounded-xl mb-4 flex items-center gap-2"
                  style={{
                    background: 'rgba(139, 105, 20, 0.15)',
                    border: '1px solid rgba(201, 162, 39, 0.3)',
                  }}
                >
                  <Lock size={14} style={{ color: '#F5D76E' }} />
                  <div className="flex-1">
                    <p className="font-tajawal text-[10px]" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      {t('السر', 'The Secret')}
                    </p>
                    <p className="font-tajawal text-sm" style={{ color: '#FFFFFF' }}>
                      {lang === 'ar' ? recipe.secret.ar : recipe.secret.en}
                    </p>
                  </div>
                </div>

                {/* الإحصائيات */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 font-tajawal text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    <ShoppingBag size={12} /> {recipe.buyers} {t('مشترٍ', 'buyers')}
                  </div>
                  <span className="font-cairo text-xl text-gradient-gold">
                    {formatPrice(recipe.price)}
                  </span>
                </div>

                <button
                  onClick={() => handleBuy(recipe)}
                  className="w-full py-3 rounded-full font-tajawal font-bold text-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #8B6914, #C9A227)',
                    color: '#FFFFFF',
                  }}
                >
                  <DollarSign size={16} /> {t('اشترِ السر', 'Buy the Secret')}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}