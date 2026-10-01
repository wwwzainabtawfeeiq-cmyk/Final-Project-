import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingBag,
  DollarSign,
  ChefHat,
  Award,
  BarChart3,
  PieChart,
  Calendar,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from "@/utils/formatPrice";
import { useEffect, useState } from 'react';
import api from '@/lib/api';

// ====== ط¨ظٹط§ظ†ط§طھ طھط¬ط±ظٹط¨ظٹط© ظ„ظ„ط±ط³ظˆظ… ط§ظ„ط¨ظٹط§ظ†ظٹط© ======
const MONTHLY_REVENUE = [
  { month: { ar: 'ظٹظ†ط§ظٹط±', en: 'Jan' }, revenue: 3200000 },
  { month: { ar: 'ظپط¨ط±ط§ظٹط±', en: 'Feb' }, revenue: 3800000 },
  { month: { ar: 'ظ…ط§ط±ط³', en: 'Mar' }, revenue: 4100000 },
  { month: { ar: 'ط£ط¨ط±ظٹظ„', en: 'Apr' }, revenue: 3700000 },
  { month: { ar: 'ظ…ط§ظٹظˆ', en: 'May' }, revenue: 4600000 },
  { month: { ar: 'ظٹظˆظ†ظٹظˆ', en: 'Jun' }, revenue: 5200000 },
  { month: { ar: 'ظٹظˆظ„ظٹظˆ', en: 'Jul' }, revenue: 4900000 },
  { month: { ar: 'ط£ط؛ط³ط·ط³', en: 'Aug' }, revenue: 5800000 },
  { month: { ar: 'ط³ط¨طھظ…ط¨ط±', en: 'Sep' }, revenue: 6200000 },
];

const CATEGORY_STATS = [
  { name: { ar: 'ظ…ط´ط§ظˆظٹ', en: 'Grills' }, orders: 2340, percent: 28, color: '#ef4444' },
  { name: { ar: 'ط£ط±ط² ظˆط¨ط±ظٹط§ظ†ظٹ', en: 'Rice & Biryani' }, orders: 1980, percent: 24, color: '#F5D76E' },
  { name: { ar: 'ط£ط·ط¨ط§ظ‚ ط±ط¦ظٹط³ظٹط©', en: 'Main Dishes' }, orders: 1650, percent: 20, color: '#22c55e' },
  { name: { ar: 'ط­ظ„ظˆظٹط§طھ', en: 'Desserts' }, orders: 1240, percent: 15, color: '#a855f7' },
  { name: { ar: 'ظ…ظ‚ط¨ظ„ط§طھ', en: 'Appetizers' }, orders: 890, percent: 10, color: '#3b82f6' },
  { name: { ar: 'ط£ط®ط±ظ‰', en: 'Others' }, orders: 400, percent: 3, color: '#6b7280' },
];

const TOP_COOKS = [
  {
    name: 'ط³طھ ظ†ظˆط±ظٹط©',
    image: 'https://images.pexels.com/photos/3770002/pexels-photo-3770002.jpeg?auto=compress&cs=tinysrgb&h=150&w=150',
    orders: 1530,
    revenue: 22950000,
    rating: 5.0,
  },
  {
    name: 'ط£ظ… ط£ط­ظ…ط¯',
    image: 'https://images.pexels.com/photos/3769999/pexels-photo-3769999.jpeg?auto=compress&cs=tinysrgb&h=150&w=150',
    orders: 1240,
    revenue: 18500000,
    rating: 4.9,
  },
  {
    name: 'ط£ط¨ظˆ ظƒط±ط§ط±',
    image: 'https://images.pexels.com/photos/8629075/pexels-photo-8629075.jpeg?auto=compress&cs=tinysrgb&h=150&w=150',
    orders: 1120,
    revenue: 16800000,
    rating: 4.8,
  },
];

const RECENT_ACTIVITY = [
  { id: 1, type: 'order', ar: 'ط·ظ„ط¨ ط¬ط¯ظٹط¯ ظ…ظ† ط£ط­ظ…ط¯ ظƒط±ظٹظ…', en: 'New order from Ahmed Karim', time: 'ظ…ظ†ط° 3 ط¯', color: '#F5D76E' },
  { id: 2, type: 'cook', ar: 'ط§ظ†ط¶ظ… ط·ط§ظ‡ظچ ط¬ط¯ظٹط¯: ط£ط¨ظˆ ط³ظٹظپ', en: 'New cook joined: Abu Saif', time: 'ظ…ظ†ط° 12 ط¯', color: '#22c55e' },
  { id: 3, type: 'review', ar: 'طھظ‚ظٹظٹظ… 5 ظ†ط¬ظˆظ… ظ…ظ† ط²ظٹظ†ط¨', en: '5-star review from Zainab', time: 'ظ…ظ†ط° 25 ط¯', color: '#a855f7' },
  { id: 4, type: 'order', ar: 'ط·ظ„ط¨ ظ…ظ„ط؛ظ‰ ظ…ظ† ط¹ظ„ظٹ ط­ط³ظٹظ†', en: 'Order cancelled by Ali Hussein', time: 'ظ…ظ†ط° 40 ط¯', color: '#ef4444' },
  { id: 5, type: 'cook', ar: 'ط£ظ… ط£ط­ظ…ط¯ ط±ظ‚ظ‘طھ ظ„ظ…ط³طھظˆظ‰ ط¨ظ„ط§طھظٹظ†ظٹ', en: 'Um Ahmed upgraded to Platinum', time: 'ظ…ظ†ط° 1 ط³', color: '#C9A227' },
];

export default function AdminOverview() {
  const { t, lang } = useLanguage();

  const [insights, setInsights] = useState(null);

  useEffect(() => {
    api.get('/admin-insights')
      .then(res => setInsights(res.data.data))
      .catch(err => console.error(err));
  }, []);

  const maxRevenue = Math.max(...MONTHLY_REVENUE.map((m) => m.revenue));
  const totalRevenue = MONTHLY_REVENUE.reduce((sum, m) => sum + m.revenue, 0);

  if (!insights) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* ====== KPI Cards ====== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: DollarSign,
            label: t('ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ط¥ظٹط±ط§ط¯ط§طھ', 'Total Revenue'),
            value: formatPrice(totalRevenue),
            change: '+18%',
            trend: 'up',
            color: '#22c55e',
          },
          {
            icon: ShoppingBag,
            label: t('ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ط·ظ„ط¨ط§طھ', 'Total Orders'),
            value: insights.orders.total_orders,
            change: '+12%',
            trend: 'up',
            color: '#F5D76E',
          },
          {
            icon: Users,
            label: t('ط§ظ„ط¹ظ…ظ„ط§ط، ط§ظ„ظ†ط´ط·ظˆظ†', 'Active Users'),
            value: insights.users.total_users,
            change: '+8%',
            trend: 'up',
            color: '#3b82f6',
          },
          {
            icon: ChefHat,
            label: t('ط§ظ„ط·ظڈظ‡ط§ط© ط§ظ„ظ…ط¹طھظ…ط¯ظˆظ†', 'Verified Cooks'),
            value: insights.users.cooks,
            change: '-2%',
            trend: 'down',
            color: '#a855f7',
          },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.trend === 'up' ? TrendingUp : TrendingDown;
          if (!insights) return <div>Loading...</div>;

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
                style={{ background: kpi.color, filter: 'blur(40px)' }}
              />
              <div className="relative z-10">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                  style={{
                    background: `linear-gradient(135deg, ${kpi.color}40, ${kpi.color}20)`,
                    border: `1px solid ${kpi.color}60`,
                  }}
                >
                  <Icon size={22} style={{ color: kpi.color }} />
                </div>
                <p
                  className="font-tajawal text-xs mb-1"
                  style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                >
                  {kpi.label}
                </p>
                <p
                  className="font-cairo text-xl font-bold mb-2"
                  style={{ color: '#FFFFFF' }}
                >
                  {kpi.value}
                </p>
                <div className="flex items-center gap-1">
                  <TrendIcon
                    size={12}
                    style={{
                      color: kpi.trend === 'up' ? '#22c55e' : '#ef4444',
                    }}
                  />
                  <span
                    className="font-cairo text-[11px]"
                    style={{
                      color: kpi.trend === 'up' ? '#22c55e' : '#ef4444',
                    }}
                  >
                    {kpi.change}
                  </span>
                  <span
                    className="font-tajawal text-[10px]"
                    style={{ color: 'rgba(255, 255, 255, 0.4)' }}
                  >
                    {t('ظ‡ط°ط§ ط§ظ„ط´ظ‡ط±', 'this month')}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ====== ط§ظ„ط±ط³ظ… ط§ظ„ط¨ظٹط§ظ†ظٹ ط§ظ„ط´ظ‡ط±ظٹ + طھظˆط²ظٹط¹ ط§ظ„ظپط¦ط§طھ ====== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ط§ظ„ط±ط³ظ… ط§ظ„ط¨ظٹط§ظ†ظٹ ط§ظ„ط´ظ‡ط±ظٹ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 rounded-2xl p-6"
          style={{
            background:
              'linear-gradient(135deg, rgba(15, 36, 25, 0.8), rgba(27, 67, 50, 0.6))',
            border: '1px solid rgba(201, 162, 39, 0.2)',
          }}
        >
          <h3 className="font-ruqaa text-xl text-gradient-gold mb-6 flex items-center gap-2">
            <BarChart3 size={20} /> {t('ط§ظ„ط¥ظٹط±ط§ط¯ط§طھ ط§ظ„ط´ظ‡ط±ظٹط©', 'Monthly Revenue')}
          </h3>

          <div className="flex items-end justify-between gap-2 h-48">
            {MONTHLY_REVENUE.map((m, i) => {
              const heightPercent = (m.revenue / maxRevenue) * 100;
              if (!insights) return <div>Loading...</div>;

  return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span
                    className="font-cairo text-[10px]"
                    style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                  >
                    {(m.revenue / 1000000).toFixed(1)}M
                  </span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ duration: 0.8, delay: i * 0.08 }}
                    className="w-full rounded-t-lg"
                    style={{
                      background:
                        'linear-gradient(180deg, #F5D76E 0%, #C9A227 100%)',
                      minHeight: '8px',
                    }}
                  />
                  <span
                    className="font-tajawal text-[10px]"
                    style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                  >
                    {lang === 'ar' ? m.month.ar : m.month.en}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* طھظˆط²ظٹط¹ ط§ظ„ظپط¦ط§طھ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl p-6"
          style={{
            background:
              'linear-gradient(135deg, rgba(15, 36, 25, 0.8), rgba(27, 67, 50, 0.6))',
            border: '1px solid rgba(201, 162, 39, 0.2)',
          }}
        >
          <h3 className="font-ruqaa text-xl text-gradient-gold mb-6 flex items-center gap-2">
            <PieChart size={20} /> {t('طھظˆط²ظٹط¹ ط§ظ„ظپط¦ط§طھ', 'Categories')}
          </h3>

          <div className="space-y-3">
            {CATEGORY_STATS.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: cat.color }}
                    />
                    <span
                      className="font-tajawal text-xs"
                      style={{ color: '#FFFFFF' }}
                    >
                      {lang === 'ar' ? cat.name.ar : cat.name.en}
                    </span>
                  </div>
                  <span
                    className="font-cairo text-xs font-bold"
                    style={{ color: cat.color }}
                  >
                    {cat.percent}%
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.percent}%` }}
                    transition={{ duration: 0.8, delay: 0.6 + i * 0.08 }}
                    className="h-full"
                    style={{ background: cat.color }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ====== ط£ظپط¶ظ„ ط§ظ„ط·ظڈظ‡ط§ط© + ط§ظ„ظ†ط´ط§ط· ط§ظ„ط£ط®ظٹط± ====== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ط£ظپط¶ظ„ ط§ظ„ط·ظڈظ‡ط§ط© */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl p-6"
          style={{
            background:
              'linear-gradient(135deg, rgba(15, 36, 25, 0.8), rgba(27, 67, 50, 0.6))',
            border: '1px solid rgba(201, 162, 39, 0.2)',
          }}
        >
          <h3 className="font-ruqaa text-xl text-gradient-gold mb-6 flex items-center gap-2">
            <Award size={20} /> {t('ط£ظپط¶ظ„ ط§ظ„ط·ظڈظ‡ط§ط©', 'Top Cooks')}
          </h3>

          <div className="space-y-4">
            {TOP_COOKS.map((cook, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(255, 255, 255, 0.05)' }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-cairo font-bold text-sm"
                  style={{
                    background:
                      i === 0
                        ? 'linear-gradient(135deg, #C9A227, #F5D76E)'
                        : i === 1
                        ? 'linear-gradient(135deg, #B8B8B8, #E5E4E2)'
                        : 'linear-gradient(135deg, #8B6914, #C9A227)',
                    color: '#0F2419',
                  }}
                >
                  {i + 1}
                </div>
                <img
                  src={cook.image}
                  alt={cook.name}
                  className="w-10 h-10 rounded-full object-cover"
                  style={{ border: '2px solid #C9A227' }}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="font-tajawal font-bold text-sm truncate"
                    style={{ color: '#FFFFFF' }}
                  >
                    {cook.name}
                  </p>
                  <p
                    className="font-cairo text-[10px]"
                    style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                  >
                    {cook.orders} {t('ط·ظ„ط¨', 'orders')} â€¢ â­گ {cook.rating}
                  </p>
                </div>
                <span className="font-cairo text-xs text-gradient-gold">
                  {formatPrice(cook.revenue)}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ط§ظ„ظ†ط´ط§ط· ط§ظ„ط£ط®ظٹط± */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl p-6"
          style={{
            background:
              'linear-gradient(135deg, rgba(15, 36, 25, 0.8), rgba(27, 67, 50, 0.6))',
            border: '1px solid rgba(201, 162, 39, 0.2)',
          }}
        >
          <h3 className="font-ruqaa text-xl text-gradient-gold mb-6 flex items-center gap-2">
            <Calendar size={20} /> {t('ط§ظ„ظ†ط´ط§ط· ط§ظ„ط£ط®ظٹط±', 'Recent Activity')}
          </h3>

          <div className="space-y-3">
            {RECENT_ACTIVITY.map((act, i) => (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.06 }}
                className="flex items-center gap-3 p-2.5 rounded-xl"
                style={{ background: 'rgba(255, 255, 255, 0.03)' }}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    background: act.color,
                    boxShadow: `0 0 8px ${act.color}`,
                  }}
                />
                <p
                  className="font-tajawal text-xs flex-1 truncate"
                  style={{ color: 'rgba(255, 255, 255, 0.85)' }}
                >
                  {lang === 'ar' ? act.ar : act.en}
                </p>
                <span
                  className="font-tajawal text-[10px] shrink-0"
                  style={{ color: 'rgba(255, 255, 255, 0.4)' }}
                >
                  {act.time}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}


