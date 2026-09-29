import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  CheckCircle,
  Package,
  Star,
  X,
  RotateCcw,
  Eye,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { meals, formatPrice } from '@/data/mockData';

// ====== أنواع البيانات ======
type OrderStatus =
  | 'received'
  | 'cooking'
  | 'ready'
  | 'delivering'
  | 'delivered'
  | 'cancelled';

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: number[];
  total: number;
  address?: string;
  eta?: string;
  cook?: string;
  rated?: boolean;
}

// ====== طلبات تجريبية ======
const mockOrders: Order[] = [
  { id: 'ORD-1024', date: '2026-09-24', status: 'delivering', items: [1, 3], total: 33000, address: 'البصرة - العشار', eta: '15-20 دقيقة', cook: 'أم أحمد' },
  { id: 'ORD-1023', date: '2026-09-22', status: 'cooking', items: [7, 12], total: 15000, address: 'البصرة - الجبيلة', eta: '35-40 دقيقة', cook: 'ست نورية' },
  { id: 'ORD-1022', date: '2026-09-20', status: 'delivered', items: [4], total: 14000, address: 'البصرة - الزبير', cook: 'أبو حسين', rated: false },
  { id: 'ORD-1021', date: '2026-09-18', status: 'delivered', items: [2, 5], total: 32000, address: 'البصرة - البراضعية', cook: 'أبو علي', rated: true },
  { id: 'ORD-1019', date: '2026-09-15', status: 'cancelled', items: [9], total: 12000, address: 'البصرة - العشار' },
];

const STATUS_LABELS: Record<OrderStatus, { ar: string; en: string; color: string }> = {
  received: { ar: 'تم الاستلام', en: 'Received', color: 'text-blue-400 bg-blue-500/10' },
  cooking: { ar: 'قيد التحضير', en: 'Cooking', color: 'text-gold-bright bg-gold/10' },
  ready: { ar: 'جاهز', en: 'Ready', color: 'text-orange-400 bg-orange-500/10' },
  delivering: { ar: 'في الطريق', en: 'Delivering', color: 'text-blue-400 bg-blue-500/10' },
  delivered: { ar: 'تم التسليم', en: 'Delivered', color: 'text-green-400 bg-green-500/10' },
  cancelled: { ar: 'ملغى', en: 'Cancelled', color: 'text-red-400 bg-red-500/10' },
};

type TabKey = 'active' | 'past' | 'cancelled';

export default function OrdersPage() {
  const { t, lang } = useLanguage();
  const [tab, setTab] = useState<TabKey>('active');
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [orders] = useState<Order[]>(mockOrders);

  const filteredOrders = orders.filter((o) => {
    if (tab === 'active') return ['received', 'cooking', 'ready', 'delivering'].includes(o.status);
    if (tab === 'past') return o.status === 'delivered';
    return o.status === 'cancelled';
  });

  const TABS: { key: TabKey; ar: string; en: string }[] = [
    { key: 'active', ar: 'الحالية', en: 'Active' },
    { key: 'past', ar: 'السابقة', en: 'Past' },
    { key: 'cancelled', ar: 'الملغاة', en: 'Cancelled' },
  ];

  return (
    <div className="min-h-screen py-24 px-4 md:px-8 max-w-4xl mx-auto">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-ruqaa text-5xl text-center text-gradient-gold mb-8">
        {t('طلباتي', 'My Orders')}
      </motion.h1>

      {/* التبويبات */}
      <div className="flex justify-center gap-2 mb-8 border-b border-gold/15">
        {TABS.map((tb) => (
          <button
            key={tb.key}
            onClick={() => setTab(tb.key)}
            className="relative px-6 py-3 font-tajawal text-sm transition-colors"
            style={{
              color: tab === tb.key ? '#F5D76E' : 'rgba(255, 255, 255, 0.5)',
              fontWeight: tab === tb.key ? 'bold' : 'normal',
            }}
          >
            {lang === 'ar' ? tb.ar : tb.en}
            {tab === tb.key && (
              <motion.span layoutId="ordersTabUnderline" className="absolute inset-x-0 -bottom-px h-0.5 bg-gold-bright" />
            )}
          </button>
        ))}
      </div>

      {/* قائمة الطلبات */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-20">
          <Package size={48} className="text-gold/30 mx-auto mb-4" />
          <p className="font-tajawal text-cream/60 text-lg">{t('لا توجد طلبات هنا', 'No orders here')}</p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order, i) => (
            <OrderCard
              key={order.id}
              order={order}
              index={i}
              onReview={() => setReviewOrder(order)}
              lang={lang}
              t={t}
            />
          ))}
        </div>
      )}

      {/* نافذة التقييم */}
      <AnimatePresence>
        {reviewOrder && <ReviewModal order={reviewOrder} onClose={() => setReviewOrder(null)} t={t} />}
      </AnimatePresence>
    </div>
  );
}

// ====== Order Card ======
function OrderCard({
  order,
  index,
  onReview,
  lang,
  t,
}: {
  order: Order;
  index: number;
  onReview: () => void;
  lang: string;
  t: (ar: string, en: string) => string;
}) {
  const navigate = useNavigate();
  const status = STATUS_LABELS[order.status];
  const orderMeals = order.items.map((id) => meals.find((m) => m.id === id)).filter(Boolean) as typeof meals;

  const canTrack = ['received', 'cooking', 'ready', 'delivering'].includes(order.status);
  const canReview = order.status === 'delivered' && !order.rated;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="glass-light rounded-2xl p-6 cursor-pointer hover:border-gold-bright transition-all"
      onClick={() => navigate(`/orders/${order.id}`)}
    >
      {/* الرأس */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="font-cairo text-lg" style={{ color: '#F5D76E' }}>{order.id}</h3>
          <p className="font-tajawal text-sm flex items-center gap-1 mt-1" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            <Clock size={14} /> {order.date}
          </p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-tajawal font-bold ${status.color}`}>
          {lang === 'ar' ? status.ar : status.en}
        </div>
      </div>

      {/* الأطباق */}
      <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
        {orderMeals.map((meal) => (
          <div key={meal.id} className="flex items-center gap-2 shrink-0 glass rounded-xl p-2">
            <img src={meal.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
            <span className="font-tajawal text-sm" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              {lang === 'ar' ? meal.name : meal.nameEn}
            </span>
          </div>
        ))}
      </div>

      {/* ملخص سريع */}
      <div className="flex items-center justify-between pt-4 border-t border-gold/10">
        <div className="flex flex-col">
          <span className="font-tajawal text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            {order.items.length} {t('أطباق', 'items')}
          </span>
          {order.cook && (
            <span className="font-tajawal text-xs mt-1" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              👨‍🍳 {order.cook}
            </span>
          )}
        </div>
        <span className="font-cairo text-xl text-gradient-gold">{formatPrice(order.total)}</span>
      </div>

      {/* الأزرار */}
      <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
        {canTrack && (
          <button
            onClick={() => navigate(`/orders/${order.id}`)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-tajawal text-sm font-bold transition-all"
            style={{ background: 'linear-gradient(135deg, #C9A227, #F5D76E)', color: '#0F2419' }}
          >
            <Eye size={16} /> {t('تتبع الطلب', 'Track Order')}
          </button>
        )}
        {canReview && (
          <button
            onClick={onReview}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-tajawal text-sm font-bold transition-all"
            style={{ border: '1px solid #F5D76E', color: '#F5D76E', backgroundColor: 'rgba(201, 162, 39, 0.1)' }}
          >
            <Star size={16} /> {t('قيّم الطباخ', 'Rate Cook')}
          </button>
        )}
        {order.status === 'delivered' && order.rated && (
          <button
            onClick={() => navigate(`/orders/${order.id}`)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-tajawal text-sm font-bold"
            style={{ border: '1px solid rgba(255, 255, 255, 0.15)', color: 'rgba(255, 255, 255, 0.5)' }}
          >
            <RotateCcw size={16} /> {t('تفاصيل الطلب', 'Order Details')}
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ====== Review Modal ======
function ReviewModal({
  order,
  onClose,
  t,
}: {
  order: Order;
  onClose: () => void;
  t: (ar: string, en: string) => string;
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 30 }}
        transition={{ type: 'spring', damping: 22, stiffness: 250 }}
        className="relative w-full max-w-md rounded-3xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0F2419 0%, #1B4332 100%)', border: '2px solid rgba(201, 162, 39, 0.4)', boxShadow: '0 25px 80px rgba(201, 162, 39, 0.3)' }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <X size={18} style={{ color: '#F5D76E' }} />
        </button>

        <div className="p-8">
          {submitted ? (
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4" style={{ background: 'linear-gradient(135deg, #C9A227, #F5D76E)' }}>
                <CheckCircle size={40} style={{ color: '#0F2419' }} />
              </div>
              <h2 className="font-ruqaa text-3xl text-gradient-gold mb-2">{t('شكراً لك!', 'Thank You!')}</h2>
              <p className="font-tajawal text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{t('تم إرسال تقييمك بنجاح', 'Your review was submitted')}</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <Star size={40} className="mx-auto mb-2" style={{ color: '#F5D76E' }} />
                <h2 className="font-ruqaa text-2xl text-gradient-gold mb-1">{t('قيّم تجربتك', 'Rate your experience')}</h2>
                <p className="font-tajawal text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{order.cook}</p>
              </div>

              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)} className="transition-transform hover:scale-125">
                    <Star size={36} style={{ color: star <= rating ? '#F5D76E' : 'rgba(255, 255, 255, 0.2)', fill: star <= rating ? '#F5D76E' : 'transparent' }} />
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                placeholder={t('شاركنا تجربتك...', 'Share your experience...')}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(201, 162, 39, 0.35)', borderRadius: '12px', padding: '12px 16px', width: '100%', fontFamily: 'Tajawal, sans-serif', fontSize: '16px', outline: 'none', resize: 'vertical', minHeight: '90px' }}
              />

              <button
                onClick={handleSubmit}
                className="w-full mt-6 py-3.5 rounded-full font-tajawal font-bold text-base transition-all hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, #C9A227, #F5D76E)', color: '#0F2419' }}
              >
                {t('إرسال التقييم', 'Submit Review')}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}