import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  Wallet,
  ArrowDownToLine,
  Calendar,
  Award,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/data/mockData';

const MOCK_EARNINGS = {
  today: 125000,
  week: 875000,
  month: 3450000,
  total: 18500000,
  commission: 10,
  nextPayout: 525000,
  payoutDate: '2026-10-05',
};

const WEEKLY_DATA = [
  { day: { ar: 'السبت', en: 'Sat' }, amount: 125000 },
  { day: { ar: 'الأحد', en: 'Sun' }, amount: 98000 },
  { day: { ar: 'الاثنين', en: 'Mon' }, amount: 145000 },
  { day: { ar: 'الثلاثاء', en: 'Tue' }, amount: 112000 },
  { day: { ar: 'الأربعاء', en: 'Wed' }, amount: 165000 },
  { day: { ar: 'الخميس', en: 'Thu' }, amount: 138000 },
  { day: { ar: 'الجمعة', en: 'Fri' }, amount: 92000 },
];

const TOP_MEALS = [
  { name: { ar: 'مسكوف بصري', en: 'Basra Masgouf' }, orders: 45, earnings: 810000 },
  { name: { ar: 'زلابية بالعسل', en: 'Zalabia with Honey' }, orders: 38, earnings: 228000 },
  { name: { ar: 'برياني أبو كرار', en: 'Abu Karar Biryani' }, orders: 32, earnings: 480000 },
];

export default function EarningsPanel() {
  const { t, lang } = useLanguage();
  const maxAmount = Math.max(...WEEKLY_DATA.map((d) => d.amount));

  return (
    <div className="space-y-6">
      {/* البطاقات الرئيسية */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: DollarSign,
            label: t('أرباح اليوم', 'Today'),
            value: MOCK_EARNINGS.today,
            color: '#22c55e',
          },
          {
            icon: TrendingUp,
            label: t('هذا الأسبوع', 'This Week'),
            value: MOCK_EARNINGS.week,
            color: '#3b82f6',
          },
          {
            icon: Calendar,
            label: t('هذا الشهر', 'This Month'),
            value: MOCK_EARNINGS.month,
            color: '#a855f7',
          },
          {
            icon: Award,
            label: t('الإجمالي', 'Total'),
            value: MOCK_EARNINGS.total,
            color: '#F5D76E',
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl p-5 relative overflow-hidden"
              style={{
                background:
                  'linear-gradient(135deg, rgba(15, 36, 25, 0.8), rgba(27, 67, 50, 0.6))',
                border: '1px solid rgba(201, 162, 39, 0.2)',
              }}
            >
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10"
                style={{ background: stat.color, filter: 'blur(40px)' }}
              />
              <div className="relative z-10">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                  style={{
                    background: `linear-gradient(135deg, ${stat.color}40, ${stat.color}20)`,
                    border: `1px solid ${stat.color}60`,
                  }}
                >
                  <Icon size={22} style={{ color: stat.color }} />
                </div>
                <p
                  className="font-tajawal text-xs mb-1"
                  style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                >
                  {stat.label}
                </p>
                <p
                  className="font-cairo text-xl font-bold"
                  style={{ color: '#FFFFFF' }}
                >
                  {formatPrice(stat.value)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* العمولة والسحب */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* العمولة */}
        <div
          className="rounded-2xl p-6"
          style={{
            background:
              'linear-gradient(135deg, rgba(15, 36, 25, 0.8), rgba(27, 67, 50, 0.5))',
            border: '1px solid rgba(201, 162, 39, 0.2)',
          }}
        >
          <h3 className="font-ruqaa text-xl text-gradient-gold mb-4 flex items-center gap-2">
            <Wallet size={20} /> {t('العمولة الحالية', 'Current Commission')}
          </h3>
          <div className="flex items-end gap-3 mb-4">
            <p className="font-cairo text-5xl font-bold text-gradient-gold">
              {MOCK_EARNINGS.commission}%
            </p>
            <span
              className="font-tajawal text-sm pb-2"
              style={{ color: 'rgba(255, 255, 255, 0.6)' }}
            >
              {t('من كل طلب', 'per order')}
            </span>
          </div>
          <p
            className="font-tajawal text-sm leading-relaxed"
            style={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            {t(
              'عمولتك الحالية كطاهٍ محترف. أنجز المزيد من الطلبات لترقية مستواك وتقليل العمولة إلى 8%.',
              'Your current commission as a professional chef. Complete more orders to level up and reduce commission to 8%.'
            )}
          </p>
        </div>

        {/* السحب */}
        <div
          className="rounded-2xl p-6"
          style={{
            background:
              'linear-gradient(135deg, rgba(15, 36, 25, 0.8), rgba(27, 67, 50, 0.5))',
            border: '1px solid rgba(201, 162, 39, 0.2)',
          }}
        >
          <h3 className="font-ruqaa text-xl text-gradient-gold mb-4 flex items-center gap-2">
            <ArrowDownToLine size={20} /> {t('الدفعة القادمة', 'Next Payout')}
          </h3>
          <p className="font-cairo text-4xl font-bold text-gradient-gold mb-2">
            {formatPrice(MOCK_EARNINGS.nextPayout)}
          </p>
          <p
            className="font-tajawal text-sm mb-4"
            style={{ color: 'rgba(255, 255, 255, 0.6)' }}
          >
            {t('التاريخ المتوقع', 'Expected date')}: {MOCK_EARNINGS.payoutDate}
          </p>
          <button
            className="w-full py-3 rounded-xl font-tajawal font-bold transition-all hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, #C9A227, #F5D76E)',
              color: '#0F2419',
            }}
          >
            {t('طلب سحب', 'Request Payout')}
          </button>
        </div>
      </div>

      {/* الرسم البياني الأسبوعي */}
      <div
        className="rounded-2xl p-6"
        style={{
          background:
            'linear-gradient(135deg, rgba(15, 36, 25, 0.8), rgba(27, 67, 50, 0.5))',
          border: '1px solid rgba(201, 162, 39, 0.2)',
        }}
      >
        <h3 className="font-ruqaa text-xl text-gradient-gold mb-6 flex items-center gap-2">
          <TrendingUp size={20} /> {t('أرباح آخر 7 أيام', 'Last 7 Days')}
        </h3>

        <div className="flex items-end justify-between gap-2 h-48">
          {WEEKLY_DATA.map((d, i) => {
            const heightPercent = (d.amount / maxAmount) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span
                  className="font-cairo text-[10px]"
                  style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                >
                  {(d.amount / 1000).toFixed(0)}k
                </span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="w-full rounded-t-lg"
                  style={{
                    background:
                      'linear-gradient(180deg, #F5D76E 0%, #C9A227 100%)',
                    minHeight: '8px',
                  }}
                />
                <span
                  className="font-tajawal text-xs"
                  style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                >
                  {lang === 'ar' ? d.day.ar : d.day.en}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* أكثر الأطباق ربحًا */}
      <div
        className="rounded-2xl p-6"
        style={{
          background:
            'linear-gradient(135deg, rgba(15, 36, 25, 0.8), rgba(27, 67, 50, 0.5))',
          border: '1px solid rgba(201, 162, 39, 0.2)',
        }}
      >
        <h3 className="font-ruqaa text-xl text-gradient-gold mb-4 flex items-center gap-2">
          <Award size={20} /> {t('أكثر الأطباق ربحًا', 'Top Earning Meals')}
        </h3>

        <div className="space-y-3">
          {TOP_MEALS.map((meal, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 p-3 rounded-xl"
              style={{ background: 'rgba(255, 255, 255, 0.05)' }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-cairo font-bold"
                style={{
                  background:
                    i === 0
                      ? 'linear-gradient(135deg, #C9A227, #F5D76E)'
                      : 'rgba(255, 255, 255, 0.1)',
                  color: i === 0 ? '#0F2419' : '#FFFFFF',
                }}
              >
                {i + 1}
              </div>
              <div className="flex-1">
                <p
                  className="font-tajawal font-bold text-sm"
                  style={{ color: '#FFFFFF' }}
                >
                  {lang === 'ar' ? meal.name.ar : meal.name.en}
                </p>
                <p
                  className="font-tajawal text-xs mt-0.5"
                  style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                >
                  {meal.orders} {t('طلب', 'orders')}
                </p>
              </div>
              <span className="font-cairo text-base text-gradient-gold">
                {formatPrice(meal.earnings)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}