import { motion } from 'framer-motion';
import { Clock, CheckCircle, Package, Truck, ChefHat } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { meals, formatPrice } from '@/data/mockData';

// طلبات تجريبية
const mockOrders = [
  { id: 'ORD-1024', date: '2026-09-24', status: 'delivered', items: [1, 3], total: 33000 },
  { id: 'ORD-1023', date: '2026-09-22', status: 'cooking', items: [7, 12], total: 15000 },
  { id: 'ORD-1022', date: '2026-09-20', status: 'delivering', items: [4], total: 14000 },
];

const statusConfig: Record<string, { color: string; label: string; labelEn: string; icon: React.ComponentType<{size?: number; className?: string}> }> = {
  delivered: { color: 'text-green-400 bg-green-900/30', label: 'تم التسليم', labelEn: 'Delivered', icon: CheckCircle },
  cooking: { color: 'text-gold-bright bg-gold/10', label: 'قيد التحضير', labelEn: 'Cooking', icon: ChefHat },
  delivering: { color: 'text-blue-400 bg-blue-900/30', label: 'قيد التوصيل', labelEn: 'Delivering', icon: Truck },
};

export default function OrdersPage() {
  const { t, lang } = useLanguage();

  return (
    <div className="min-h-screen py-24 px-4 md:px-8 max-w-4xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-ruqaa text-5xl text-center text-gradient-gold mb-12"
      >
        {t('طلباتي', 'My Orders')}
      </motion.h1>

      <div className="space-y-6">
        {mockOrders.map((order, i) => {
          const status = statusConfig[order.status];
          const StatusIcon = status.icon;
          const orderMeals = order.items.map(id => meals.find(m => m.id === id)!).filter(Boolean);

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="glass-light rounded-2xl p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-cairo text-lg text-gold-bright">{order.id}</h3>
                  <p className="text-cream/50 font-tajawal text-sm flex items-center gap-1">
                    <Clock size={14} /> {order.date}
                  </p>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-tajawal font-bold ${status.color}`}>
                  <StatusIcon size={16} />
                  {lang === 'ar' ? status.label : status.labelEn}
                </div>
              </div>

              {/* عناصر الطلب */}
              <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
                {orderMeals.map(meal => (
                  <div key={meal.id} className="flex items-center gap-2 shrink-0 glass rounded-xl p-2">
                    <img src={meal.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <span className="font-tajawal text-sm text-cream">{lang === 'ar' ? meal.name : meal.nameEn}</span>
                  </div>
                ))}
              </div>

              {/* Timeline للحالة */}
              {order.status !== 'delivered' && (
                <div className="flex items-center gap-2 mb-4">
                  {[
                    { icon: CheckCircle, label: t('تم الطلب', 'Ordered'), done: true },
                    { icon: ChefHat, label: t('التحضير', 'Cooking'), done: order.status === 'cooking' || order.status === 'delivering' },
                    { icon: Truck, label: t('التوصيل', 'Delivery'), done: order.status === 'delivering' },
                  ].map((s, si) => (
                    <div key={si} className="flex items-center flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${s.done ? 'bg-gold text-emerald-deep' : 'glass text-cream/40'}`}>
                        <s.icon size={14} />
                      </div>
                      {si < 2 && <div className={`h-0.5 flex-1 mx-1 ${s.done ? 'bg-gold' : 'bg-gold/20'}`} />}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gold/10">
                <span className="text-cream/60 font-tajawal">{order.items.length} {t('أطباق', 'items')}</span>
                <span className="font-cairo text-xl text-gradient-gold">{formatPrice(order.total)}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
