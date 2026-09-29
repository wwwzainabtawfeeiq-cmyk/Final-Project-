import { motion } from 'framer-motion';
import { Package, DollarSign, Star, Users, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface CookStatsProps {
  ordersToday: number;
  earningsToday: number;
  rating: number;
  newCustomers: number;
}

export default function CookStats({
  ordersToday,
  earningsToday,
  rating,
  newCustomers,
}: CookStatsProps) {
  const { t } = useLanguage();

  const stats = [
    {
      icon: Package,
      label: t('طلبات اليوم', 'Orders Today'),
      value: ordersToday,
      color: '#F5D76E',
      trend: '+12%',
    },
    {
      icon: DollarSign,
      label: t('أرباح اليوم', 'Earnings Today'),
      value: `${earningsToday.toLocaleString()} د.ع`,
      color: '#22c55e',
      trend: '+8%',
    },
    {
      icon: Star,
      label: t('التقييم', 'Rating'),
      value: rating.toFixed(1),
      color: '#F5D76E',
      trend: t('ثابت', 'Stable'),
    },
    {
      icon: Users,
      label: t('عملاء جدد', 'New Customers'),
      value: newCustomers,
      color: '#3b82f6',
      trend: '+5%',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, rgba(15, 36, 25, 0.8), rgba(27, 67, 50, 0.6))',
              border: '1px solid rgba(201, 162, 39, 0.2)',
            }}
          >
            {/* خلفية متوهجة */}
            <div
              className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10"
              style={{
                background: stat.color,
                filter: 'blur(40px)',
              }}
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
                className="font-cairo text-2xl font-bold mb-2"
                style={{ color: '#FFFFFF' }}
              >
                {stat.value}
              </p>

              {/* Trend */}
              <div className="flex items-center gap-1">
                <TrendingUp size={12} style={{ color: stat.color }} />
                <span
                  className="font-cairo text-[11px]"
                  style={{ color: stat.color }}
                >
                  {stat.trend}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}