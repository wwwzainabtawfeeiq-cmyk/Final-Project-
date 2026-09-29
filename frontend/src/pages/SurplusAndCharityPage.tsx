import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Package,
  Users,
  MapPin,
  Clock,
  Gift,
  HandHeart,
  Award,
  Search,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface SurplusItem {
  id: number;
  title: { ar: string; en: string };
  cook: string;
  portions: number;
  area: string;
  expiresIn: string;
  image: string;
  type: 'surplus' | 'donation';
}

const MOCK_ITEMS: SurplusItem[] = [
  {
    id: 1,
    title: { ar: 'مسكوف بصري طازج', en: 'Fresh Basra Masgouf' },
    cook: 'أم أحمد',
    portions: 5,
    area: 'العشار',
    expiresIn: 'ساعتان',
    image: 'https://images.pexels.com/photos/36796430/pexels-photo-36796430.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    type: 'surplus',
  },
  {
    id: 2,
    title: { ar: 'برياني أبو كرار', en: 'Abu Karar Biryani' },
    cook: 'أبو كرار',
    portions: 8,
    area: 'الجبيلة',
    expiresIn: '3 ساعات',
    image: 'https://images.pexels.com/photos/32986475/pexels-photo-32986475.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    type: 'surplus',
  },
  {
    id: 3,
    title: { ar: 'دولمة ورق عنب', en: 'Stuffed Grape Leaves' },
    cook: 'أبو علي',
    portions: 12,
    area: 'الزبير',
    expiresIn: '4 ساعات',
    image: 'https://images.pexels.com/photos/8197794/pexels-photo-8197794.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    type: 'donation',
  },
  {
    id: 4,
    title: { ar: 'هريسة بصري', en: 'Basra Hareesa' },
    cook: 'أم سيف',
    portions: 6,
    area: 'الجزائر',
    expiresIn: 'ساعة',
    image: 'https://images.pexels.com/photos/11369845/pexels-photo-11369845.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    type: 'surplus',
  },
  {
    id: 5,
    title: { ar: 'كباب بصري', en: 'Basra Kebab' },
    cook: 'أبو حسين',
    portions: 10,
    area: 'البراضعية',
    expiresIn: '5 ساعات',
    image: 'https://images.pexels.com/photos/32986489/pexels-photo-32986489.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    type: 'donation',
  },
  {
    id: 6,
    title: { ar: 'زلابية بالعسل', en: 'Zalabia with Honey' },
    cook: 'ست نورية',
    portions: 15,
    area: 'خمسة ميل',
    expiresIn: '6 ساعات',
    image: 'https://images.pexels.com/photos/31786489/pexels-photo-31786489.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    type: 'surplus',
  },
];

const TYPE_CONFIG = {
  surplus: { ar: 'فائض', en: 'Surplus', color: '#F5D76E', icon: Package },
  donation: { ar: 'تبرع', en: 'Donation', color: '#ef4444', icon: Heart },
};

export default function SurplusAndCharityPage() {
  const { t, lang } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'surplus' | 'donation'>('all');
  const [search, setSearch] = useState('');

  const filteredItems = MOCK_ITEMS.filter((item) => {
    const matchFilter = filter === 'all' || item.type === filter;
    const matchSearch =
      item.title.ar.includes(search) ||
      item.title.en.toLowerCase().includes(search.toLowerCase()) ||
      item.cook.includes(search);
    return matchFilter && matchSearch;
  });

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
          style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
        >
          <HandHeart size={40} style={{ color: '#FFFFFF' }} />
        </div>
        <h1 className="font-ruqaa text-5xl text-gradient-gold text-glow-gold mb-3">
          {t('الفائض والخير', 'Surplus & Charity')}
        </h1>
        <p
          className="font-tajawal text-lg max-w-2xl mx-auto"
          style={{ color: 'rgba(255, 255, 255, 0.6)' }}
        >
          {t(
            'ساعدنا في تقليل هدر الطعام — شارك الفائض أو تبرع بالوجبات للمحتاجين',
            'Help us reduce food waste — share surplus or donate meals to those in need'
          )}
        </p>
      </motion.div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-3 gap-4 mb-10 max-w-3xl mx-auto">
        {[
          { icon: Package, label: t('وجبة فائضة', 'Surplus meals'), value: 156, color: '#F5D76E' },
          { icon: Heart, label: t('وجبة متبرع بها', 'Donated meals'), value: 89, color: '#ef4444' },
          { icon: Users, label: t('مستفيد', 'Beneficiaries'), value: 234, color: '#22c55e' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-4 text-center"
              style={{
                background:
                  'linear-gradient(135deg, rgba(15, 36, 25, 0.8), rgba(27, 67, 50, 0.6))',
                border: '1px solid rgba(201, 162, 39, 0.2)',
              }}
            >
              <Icon size={24} className="mx-auto mb-2" style={{ color: stat.color }} />
              <p className="font-cairo text-2xl font-bold" style={{ color: '#FFFFFF' }}>
                {stat.value}
              </p>
              <p className="font-tajawal text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                {stat.label}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* البحث والفلاتر */}
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
            placeholder={t('ابحث عن طبق أو طباخ...', 'Search meal or cook...')}
            className="w-full rounded-xl py-2.5 pr-11 pl-4 font-tajawal text-sm"
          />
        </div>

        <div className="flex gap-2">
          {[
            { key: 'all' as const, ar: 'الكل', en: 'All' },
            { key: 'surplus' as const, ar: 'الفائض', en: 'Surplus' },
            { key: 'donation' as const, ar: 'التبرعات', en: 'Donations' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="px-4 py-2 rounded-full font-tajawal text-xs font-bold whitespace-nowrap transition-all"
              style={{
                background:
                  filter === f.key
                    ? 'linear-gradient(135deg, #C9A227, #F5D76E)'
                    : 'rgba(255, 255, 255, 0.08)',
                color: filter === f.key ? '#0F2419' : 'rgba(255, 255, 255, 0.7)',
                border:
                  filter === f.key ? 'none' : '1px solid rgba(201, 162, 39, 0.25)',
              }}
            >
              {lang === 'ar' ? f.ar : f.en}
            </button>
          ))}
        </div>
      </div>

      {/* الشبكة */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20">
          <Package size={48} className="mx-auto mb-4" style={{ color: 'rgba(201, 162, 39, 0.3)' }} />
          <p className="font-tajawal text-lg" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            {t('لا توجد عناصر', 'No items')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item, i) => {
            const typeConf = TYPE_CONFIG[item.type];
            const TypeIcon = typeConf.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-3xl overflow-hidden group"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(15, 36, 25, 0.9), rgba(27, 67, 50, 0.6))',
                  border: `1px solid ${typeConf.color}40`,
                }}
              >
                {/* الصورة */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={item.image}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep via-transparent to-transparent" />

                  {/* Badge النوع */}
                  <div
                    className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-tajawal font-bold"
                    style={{
                      background: `${typeConf.color}E6`,
                      color: '#0F2419',
                    }}
                  >
                    <TypeIcon size={12} />
                    {lang === 'ar' ? typeConf.ar : typeConf.en}
                  </div>
                </div>

                {/* المحتوى */}
                <div className="p-5">
                  <h3 className="font-ruqaa text-xl text-gradient-gold mb-2">
                    {lang === 'ar' ? item.title.ar : item.title.en}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 font-tajawal text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      👨‍🍳 {item.cook}
                    </div>
                    <div className="flex items-center gap-2 font-tajawal text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      <MapPin size={12} style={{ color: '#F5D76E' }} /> {item.area}
                    </div>
                    <div className="flex items-center gap-2 font-tajawal text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      <Clock size={12} style={{ color: '#F5D76E' }} /> {t('ينتهي بعد', 'Expires in')} {item.expiresIn}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gold/10 mb-4">
                    <span className="font-tajawal text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      {t('الكمية', 'Portions')}
                    </span>
                    <span className="font-cairo text-lg text-gradient-gold">
                      {item.portions} {t('وجبة', 'meals')}
                    </span>
                  </div>

                  <button
                    className="w-full py-3 rounded-full font-tajawal font-bold text-sm transition-all hover:scale-[1.02]"
                    style={{
                      background:
                        item.type === 'donation'
                          ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                          : 'linear-gradient(135deg, #C9A227, #F5D76E)',
                      color: '#FFFFFF',
                    }}
                  >
                    {item.type === 'donation'
                      ? t('استلم التبرع', 'Claim Donation')
                      : t('احصل على الفائض', 'Get Surplus')}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 rounded-3xl p-10 text-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1B4332 0%, #0F2419 100%)',
          border: '1px solid rgba(201, 162, 39, 0.3)',
        }}
      >
        <Award size={48} className="mx-auto mb-4" style={{ color: '#F5D76E' }} />
        <h2 className="font-ruqaa text-3xl text-gradient-gold mb-3">
          {t('هل لديك فائض طعام؟', 'Do you have surplus food?')}
        </h2>
        <p className="font-tajawal mb-6 max-w-xl mx-auto" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          {t(
            'شارك فائض الطعام مع المحتاجين بدلاً من هدره. كل وجبة تُحدث فرقًا.',
            'Share surplus food with those in need instead of wasting it. Every meal makes a difference.'
          )}
        </p>
        <button
          className="px-8 py-4 rounded-full font-tajawal font-bold text-lg transition-all hover:scale-105 flex items-center gap-2 mx-auto"
          style={{
            background: 'linear-gradient(135deg, #C9A227, #F5D76E)',
            color: '#0F2419',
          }}
        >
          <Gift size={20} /> {t('تبرع الآن', 'Donate Now')}
        </button>
      </motion.div>
    </div>
  );
}