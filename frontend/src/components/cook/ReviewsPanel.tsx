import { motion } from 'framer-motion';
import { Star, MessageSquare, Award } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface Review {
  id: number;
  customer: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  meal: string;
  subRatings: {
    taste: number;
    packaging: number;
    speed: number;
    cleanliness: number;
  };
}

const MOCK_REVIEWS: Review[] = [
  {
    id: 1,
    customer: 'كرار الموسوي',
    avatar: 'https://images.pexels.com/photos/4253298/pexels-photo-4253298.jpeg?auto=compress&cs=tinysrgb&h=150&w=150',
    rating: 5,
    comment: 'أفضل مسكوف تذوقته منذ زمن! الطبق وصل ساخناً وطازجاً كأنه من بيت أمي.',
    date: '2026-09-28',
    meal: 'مسكوف بصري',
    subRatings: { taste: 5, packaging: 5, speed: 5, cleanliness: 5 },
  },
  {
    id: 2,
    customer: 'زينب عبد الله',
    avatar: 'https://images.pexels.com/photos/3770002/pexels-photo-3770002.jpeg?auto=compress&cs=tinysrgb&h=150&w=150',
    rating: 5,
    comment: 'الزلابية كانت خيالية! ابني طلب وصفة لأني ما أعرف أسويها مثلها.',
    date: '2026-09-27',
    meal: 'زلابية بالعسل',
    subRatings: { taste: 5, packaging: 5, speed: 4, cleanliness: 5 },
  },
  {
    id: 3,
    customer: 'حسين الكعبي',
    avatar: 'https://images.pexels.com/photos/24252237/pexels-photo-24252237.jpeg?auto=compress&cs=tinysrgb&h=150&w=150',
    rating: 4,
    comment: 'برياني رائع والتوصيل سريع. لكن كان حارًا قليلاً.',
    date: '2026-09-26',
    meal: 'برياني أبو كرار',
    subRatings: { taste: 4, packaging: 5, speed: 5, cleanliness: 4 },
  },
  {
    id: 4,
    customer: 'مريم علي',
    avatar: 'https://images.pexels.com/photos/3769739/pexels-photo-3769739.jpeg?auto=compress&cs=tinysrgb&h=150&w=150',
    rating: 5,
    comment: 'هريسة مثالية! طعم الجدات الأصيل.',
    date: '2026-09-25',
    meal: 'هريسة بصري',
    subRatings: { taste: 5, packaging: 4, speed: 5, cleanliness: 5 },
  },
];

export default function ReviewsPanel() {
  const { t } = useLanguage();

  // حساب الإحصائيات
  const totalReviews = MOCK_REVIEWS.length;
  const avgRating =
    MOCK_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: MOCK_REVIEWS.filter((r) => r.rating === star).length,
    percent:
      (MOCK_REVIEWS.filter((r) => r.rating === star).length / totalReviews) * 100,
  }));

  const avgSub = {
    taste:
      MOCK_REVIEWS.reduce((sum, r) => sum + r.subRatings.taste, 0) / totalReviews,
    packaging:
      MOCK_REVIEWS.reduce((sum, r) => sum + r.subRatings.packaging, 0) /
      totalReviews,
    speed:
      MOCK_REVIEWS.reduce((sum, r) => sum + r.subRatings.speed, 0) / totalReviews,
    cleanliness:
      MOCK_REVIEWS.reduce((sum, r) => sum + r.subRatings.cleanliness, 0) /
      totalReviews,
  };

  return (
    <div className="space-y-6">
      {/* ملخص التقييمات */}
      <div
        className="rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6"
        style={{
          background:
            'linear-gradient(135deg, rgba(15, 36, 25, 0.8), rgba(27, 67, 50, 0.5))',
          border: '1px solid rgba(201, 162, 39, 0.2)',
        }}
      >
        {/* المتوسط */}
        <div className="text-center md:border-l border-gold/10 md:pl-6">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-3"
            style={{ background: 'linear-gradient(135deg, #C9A227, #F5D76E)' }}
          >
            <Award size={32} style={{ color: '#0F2419' }} />
          </div>
          <p className="font-cairo text-5xl font-bold text-gradient-gold mb-1">
            {avgRating.toFixed(1)}
          </p>
          <div className="flex justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={16}
                fill={s <= Math.round(avgRating) ? '#F5D76E' : 'transparent'}
                color="#F5D76E"
              />
            ))}
          </div>
          <p
            className="font-tajawal text-sm"
            style={{ color: 'rgba(255, 255, 255, 0.6)' }}
          >
            {totalReviews} {t('تقييم', 'reviews')}
          </p>
        </div>

        {/* التوزيع */}
        <div className="md:col-span-2 space-y-2">
          {ratingDistribution.map((r) => (
            <div key={r.star} className="flex items-center gap-3">
              <span
                className="font-cairo text-sm w-8"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                {r.star} ★
              </span>
              <div
                className="flex-1 h-2 rounded-full overflow-hidden"
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${r.percent}%` }}
                  transition={{ duration: 0.8, delay: 0.1 * (5 - r.star) }}
                  className="h-full"
                  style={{
                    background: 'linear-gradient(90deg, #C9A227, #F5D76E)',
                  }}
                />
              </div>
              <span
                className="font-cairo text-xs w-10 text-left"
                style={{ color: 'rgba(255, 255, 255, 0.5)' }}
              >
                {r.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* التقييمات الفرعية */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { key: 'taste', ar: 'الطعم', en: 'Taste', icon: '😋' },
          { key: 'packaging', ar: 'التغليف', en: 'Packaging', icon: '📦' },
          { key: 'speed', ar: 'السرعة', en: 'Speed', icon: '⚡' },
          { key: 'cleanliness', ar: 'النظافة', en: 'Cleanliness', icon: '✨' },
        ].map((sub) => {
          const value = avgSub[sub.key as keyof typeof avgSub];
          return (
            <motion.div
              key={sub.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-4 text-center"
              style={{
                background:
                  'linear-gradient(135deg, rgba(15, 36, 25, 0.8), rgba(27, 67, 50, 0.5))',
                border: '1px solid rgba(201, 162, 39, 0.2)',
              }}
            >
              <div className="text-3xl mb-2">{sub.icon}</div>
              <p className="font-cairo text-2xl font-bold text-gradient-gold mb-1">
                {value.toFixed(1)}
              </p>
              <p
                className="font-tajawal text-xs"
                style={{ color: 'rgba(255, 255, 255, 0.6)' }}
              >
                {t(sub.ar, sub.en)}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* قائمة التقييمات */}
      <div>
        <h3 className="font-ruqaa text-2xl text-gradient-gold mb-4 flex items-center gap-2">
          <MessageSquare size={24} /> {t('آخر التقييمات', 'Recent Reviews')}
        </h3>

        <div className="space-y-4">
          {MOCK_REVIEWS.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl p-5"
              style={{
                background:
                  'linear-gradient(135deg, rgba(15, 36, 25, 0.8), rgba(27, 67, 50, 0.5))',
                border: '1px solid rgba(201, 162, 39, 0.2)',
              }}
            >
              {/* رأس التقييم */}
              <div className="flex items-start gap-4 mb-3">
                <img
                  src={review.avatar}
                  alt={review.customer}
                  className="w-12 h-12 rounded-full object-cover"
                  style={{ border: '2px solid #C9A227' }}
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4
                        className="font-tajawal font-bold text-base"
                        style={{ color: '#FFFFFF' }}
                      >
                        {review.customer}
                      </h4>
                      <p
                        className="font-tajawal text-xs mt-0.5"
                        style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                      >
                        {review.meal} • {review.date}
                      </p>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          fill={s <= review.rating ? '#F5D76E' : 'transparent'}
                          color="#F5D76E"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <p
                className="font-tajawal text-sm leading-relaxed"
                style={{ color: 'rgba(255, 255, 255, 0.8)' }}
              >
                {review.comment}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}