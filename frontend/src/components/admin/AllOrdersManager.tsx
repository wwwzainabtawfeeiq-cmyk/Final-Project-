import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag,  CheckCircle, Truck, ChefHat, Package, Search, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/data/mockData';

interface AdminOrder {
  id: string;
  customer: string;
  cook: string;
  items: number;
  total: number;
  status: 'received' | 'cooking' | 'ready' | 'delivering' | 'delivered' | 'cancelled';
  date: string;
  address: string;
}

const MOCK_ORDERS: AdminOrder[] = [
  { id: 'ORD-1024', customer: 'أحمد كريم', cook: 'أم أحمد', items: 2, total: 36000, status: 'delivering', date: '2026-09-29', address: 'العشار' },
  { id: 'ORD-1023', customer: 'زينب علي', cook: 'ست نورية', items: 2, total: 20000, status: 'cooking', date: '2026-09-29', address: 'الجبيلة' },
  { id: 'ORD-1022', customer: 'حسين محمد', cook: 'أبو كرار', items: 3, total: 45000, status: 'ready', date: '2026-09-29', address: 'الزبير' },
  { id: 'ORD-1021', customer: 'فاطمة سالم', cook: 'أبو علي', items: 1, total: 22000, status: 'delivered', date: '2026-09-28', address: 'البراضعية' },
  { id: 'ORD-1020', customer: 'علي حسن', cook: 'أبو حسين', items: 1, total: 14000, status: 'delivered', date: '2026-09-28', address: 'العشار' },
  { id: 'ORD-1019', customer: 'مريم كريم', cook: 'أم أحمد', items: 1, total: 12000, status: 'cancelled', date: '2026-09-27', address: 'الجبيلة' },
];

const STATUS_CONFIG = {
  received: { ar: 'استُلم', en: 'Received', color: '#3b82f6', icon: CheckCircle },
  cooking: { ar: 'قيد التحضير', en: 'Cooking', color: '#F5D76E', icon: ChefHat },
  ready: { ar: 'جاهز', en: 'Ready', color: '#f97316', icon: Package },
  delivering: { ar: 'في الطريق', en: 'Delivering', color: '#a855f7', icon: Truck },
  delivered: { ar: 'مُسلّم', en: 'Delivered', color: '#22c55e', icon: CheckCircle },
  cancelled: { ar: 'ملغى', en: 'Cancelled', color: '#ef4444', icon: X },
};

export default function AllOrdersManager() {
  const { t, lang } = useLanguage();
  const [orders] = useState(MOCK_ORDERS);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filteredOrders = orders.filter((o) => {
    const matchFilter = filter === 'all' || o.status === filter;
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="font-ruqaa text-2xl text-gradient-gold flex items-center gap-2">
          <ShoppingBag size={24} /> {t('كل الطلبات', 'All Orders')}
        </h2>

        <div className="relative flex-1 max-w-xs">
          <Search size={18} className="absolute top-1/2 -translate-y-1/2 right-3" style={{ color: 'rgba(201, 162, 39, 0.6)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('ابحث برقم الطلب...', 'Search order...')}
            className="w-full rounded-xl py-2.5 pr-11 pl-4 font-tajawal text-sm"
          />
        </div>
      </div>

      {/* فلاتر */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { key: 'all', ar: 'الكل', en: 'All' },
          { key: 'received', ar: 'استُلم', en: 'Received' },
          { key: 'cooking', ar: 'التحضير', en: 'Cooking' },
          { key: 'ready', ar: 'جاهز', en: 'Ready' },
          { key: 'delivering', ar: 'التوصيل', en: 'Delivering' },
          { key: 'delivered', ar: 'مُسلّم', en: 'Delivered' },
          { key: 'cancelled', ar: 'ملغى', en: 'Cancelled' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="px-3 py-2 rounded-full font-tajawal text-xs font-bold whitespace-nowrap transition-all"
            style={{
              background: filter === f.key ? 'linear-gradient(135deg, #C9A227, #F5D76E)' : 'rgba(255, 255, 255, 0.08)',
              color: filter === f.key ? '#0F2419' : 'rgba(255, 255, 255, 0.7)',
            }}
          >
            {lang === 'ar' ? f.ar : f.en}
          </button>
        ))}
      </div>

      {/* القائمة */}
      <div className="space-y-3">
        {filteredOrders.map((order, i) => {
          const status = STATUS_CONFIG[order.status];
          const StatusIcon = status.icon;
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
              style={{
                background: 'linear-gradient(135deg, rgba(15, 36, 25, 0.8), rgba(27, 67, 50, 0.5))',
                border: '1px solid rgba(201, 162, 39, 0.2)',
              }}
            >
              <div className="md:col-span-2">
                <p className="font-cairo text-sm font-bold" style={{ color: '#F5D76E' }}>{order.id}</p>
                <p className="font-cairo text-xs mt-1" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>{order.date}</p>
              </div>
              <div className="md:col-span-3">
                <p className="font-tajawal text-sm" style={{ color: '#FFFFFF' }}>👤 {order.customer}</p>
                <p className="font-tajawal text-xs mt-1" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>👨‍🍳 {order.cook}</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-tajawal text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  📍 {order.address}
                </p>
                <p className="font-tajawal text-xs mt-1" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  {order.items} {t('أطباق', 'items')}
                </p>
              </div>
              <div className="md:col-span-2">
                <span
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-tajawal font-bold"
                  style={{ background: `${status.color}20`, color: status.color, border: `1px solid ${status.color}40` }}
                >
                  <StatusIcon size={12} />
                  {lang === 'ar' ? status.ar : status.en}
                </span>
              </div>
              <div className="md:col-span-3 text-left">
                <span className="font-cairo text-lg text-gradient-gold">{formatPrice(order.total)}</span>
              </div>
            </motion.div>
          );
        })}

        {filteredOrders.length === 0 && (
          <div className="py-16 text-center">
            <p className="font-tajawal" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              {t('لا توجد طلبات', 'No orders')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}