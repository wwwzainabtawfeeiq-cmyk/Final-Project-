import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageCircle, UserPlus, UserCheck,  ChefHat } from 'lucide-react';
import { cooks, meals } from '@/data/mockData';
import { useLanguage } from '@/context/LanguageContext';

type TabKey = 'meals' | 'services' | 'reviews' | 'bio';

export default function CookProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { t, lang } = useLanguage();
  const cook = cooks.find((c) => String(c.id) === id);

  const [tab, setTab] = useState<TabKey>('meals');
  const [following, setFollowing] = useState(false);

  if (!cook) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-ruqaa text-3xl text-gradient-gold mb-4">
            {t('لم نجد هذا الطباخ', 'Cook not found')}
          </h2>
          <Link
            to="/cooks"
            className="inline-block px-6 py-3 rounded-full font-tajawal font-bold text-emerald-deep"
            style={{ background: 'linear-gradient(135deg, #C9A227, #F5D76E)' }}
          >
            {t('العودة للطُهاة', 'Back to Cooks')}
          </Link>
        </div>
      </div>
    );
  }

  const cookMeals = meals.filter((m) => m.cookId === cook.id);
  const name = lang === 'ar' ? cook.name : cook.nameEn;
  const specialty = lang === 'ar' ? cook.specialty : cook.specialtyEn;
  const bio = lang === 'ar' ? cook.bio : cook.bioEn;

  const TABS: { key: TabKey; label: string }[] = [
    { key: 'meals', label: t('الأطباق', 'Dishes') },
    { key: 'services', label: t('الخدمات', 'Services') },
    { key: 'reviews', label: t('التقييمات', 'Reviews') },
    { key: 'bio', label: t('نبذة', 'About') },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* رأس البروفايل */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center mb-10"
        >
          {/* الصورة */}
          <div className="relative h-32 w-32 mb-4">
            <motion.div
              animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 2.4, repeat: Infinity }}
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(201,162,39,0.5), transparent 70%)',
              }}
            />
            <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-gold-bright shadow-lg">
              {cook.image ? (
                <img src={cook.image} alt={name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-emerald-deep">
                  <span className="font-ruqaa text-4xl text-gold-bright">{name[0]}</span>
                </div>
              )}
            </div>
          </div>

          {/* الاسم والتخصص */}
          <h1 className="font-ruqaa text-4xl md:text-5xl text-gradient-gold mb-2">{name}</h1>
          <p className="flex items-center gap-2 text-gold-bright font-tajawal mb-3">
            <ChefHat size={16} /> {specialty}
          </p>

          {/* المعلومات */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-cream/60 font-tajawal text-sm mb-5">
            <span className="flex items-center gap-1 text-gold-bright">
              <Star size={14} fill="currentColor" /> {cook.rating}
            </span>
            <span>
              · {cook.orders} {t('طلب', 'orders')}
            </span>
          </div>

          {/* الأزرار */}
          <div className="flex gap-3">
            <button
              onClick={() => setFollowing((v) => !v)}
              className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all ${
                following ? 'border border-gold/40 text-gold-bright' : 'text-emerald-deep'
              }`}
              style={!following ? { background: 'linear-gradient(135deg, #C9A227, #F5D76E)' } : {}}
            >
              {following ? <UserCheck size={16} /> : <UserPlus size={16} />}
              {following ? t('متابَع', 'Following') : t('متابعة', 'Follow')}
            </button>

            <button className="flex items-center gap-2 rounded-full border border-gold/40 text-gold-bright px-6 py-3 text-sm font-bold hover:bg-gold/10 transition-colors">
              <MessageCircle size={16} /> {t('تواصل معه', 'Contact')}
            </button>
          </div>
        </motion.div>

        {/* التبويبات */}
        <div className="flex justify-center gap-2 border-b border-gold/15 mb-8 overflow-x-auto">
          {TABS.map((tabItem) => (
            <button
              key={tabItem.key}
              onClick={() => setTab(tabItem.key)}
              className={`relative px-6 py-3 font-tajawal text-sm transition-colors whitespace-nowrap ${
                tab === tabItem.key
                  ? 'text-gold-bright font-bold'
                  : 'text-cream/50 hover:text-cream/80'
              }`}
            >
              {tabItem.label}
              {tab === tabItem.key && (
                <motion.span
                  layoutId="cookTabUnderline"
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-gold-bright"
                />
              )}
            </button>
          ))}
        </div>

        {/* المحتوى */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* الأطباق */}
            {tab === 'meals' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {cookMeals.length === 0 && (
                  <p className="col-span-full text-center text-cream/40 py-10 font-tajawal">
                    {t('لا توجد أطباق بعد', 'No dishes yet')}
                  </p>
                )}
                {cookMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="rounded-2xl overflow-hidden border border-gold/20 hover:border-gold-bright transition-all group"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={meal.image}
                        alt={meal.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3 bg-emerald-deep">
                      <h3 className="font-tajawal font-bold text-cream text-sm truncate">
                        {lang === 'ar' ? meal.name : meal.nameEn}
                      </h3>
                      <p className="font-cairo text-gold-bright text-xs mt-1">
                        {meal.price.toLocaleString()} د.ع
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* الخدمات */}
            {tab === 'services' && (
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  t('طلبات المناسبات', 'Event Orders'),
                  t('الطلب المسبق', 'Pre-Order'),
                  t('التوصيل السريع', 'Fast Delivery'),
                  t('الوجبات الأسبوعية', 'Weekly Meals'),
                ].map((service, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-2xl border border-gold/20 p-5 font-tajawal text-cream/80 bg-emerald-deep/50"
                  >
                    ✓ {service}
                  </motion.div>
                ))}
              </div>
            )}

            {/* التقييمات */}
            {tab === 'reviews' && (
              <div className="space-y-4">
                <div className="text-center text-cream/40 py-10 font-tajawal">
                  {t('لا توجد تقييمات بعد', 'No reviews yet')}
                </div>
              </div>
            )}

            {/* نبذة */}
            {tab === 'bio' && (
              <div className="max-w-2xl mx-auto text-center rounded-2xl border border-gold/20 p-8 bg-emerald-deep/50">
                <p className="font-tajawal text-cream/80 leading-relaxed">{bio}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}